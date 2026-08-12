import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Loader2, Clock, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { mockTests as fallbackTests } from '../mock/mockData';
import { mockTestsApi, questionsApi, progressApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

// A test's "sections" are human labels (Aptitude, Coding, Technical, System Design,
// Behavioral, Verbal) — map each to the backend's actual questionType, and note
// which ones should be pulled for the user's specific role vs the shared bank.
const SECTION_MAP = {
  Aptitude: { type: 'APTITUDE', roleSpecific: false },
  Verbal: { type: 'APTITUDE', roleSpecific: false },
  Coding: { type: 'CODING', roleSpecific: true },
  Technical: { type: 'CODING', roleSpecific: true }, // approximation: no dedicated TECHNICAL question type yet
  'System Design': { type: 'SYSTEM_DESIGN', roleSpecific: true },
  Behavioral: { type: 'BEHAVIORAL', roleSpecific: true },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MockTestRunner = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [test, setTest] = useState(null);
  const [role, setRole] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});          // { [id]: chosen/typed answer }
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);         // { score, total, perQuestion: [...] }

  // Load test metadata + user's selected role, then pull questions per section
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [tests, progress] = await Promise.allSettled([
          mockTestsApi.getAll(),
          progressApi.get(),
        ]);
        const allTests = tests.status === 'fulfilled' ? tests.value : fallbackTests;
        const found = allTests.find(t => t.id === testId);
        if (!found) { if (!cancelled) setLoadError('Test not found.'); return; }
        if (cancelled) return;
        setTest(found);

        // Prefer the role baked into the test itself (role-wise mock tests) and fall
        // back to the user's saved profile role for role-agnostic tests (Aptitude, etc.)
        const profileRole = progress.status === 'fulfilled' ? progress.value?.selectedRole : null;
        const roleTag = found.role || profileRole || null;
        setRole(roleTag || null);

        const sections = (found.sections || []).length ? found.sections : ['Aptitude'];
        const uniqueTypes = [...new Set(sections.map(s => SECTION_MAP[s]?.type || 'APTITUDE'))];
        const perSection = Math.max(5, Math.min(10, Math.ceil((found.questions || 10) / uniqueTypes.length)));

        const batches = await Promise.allSettled(
          sections.map((s) => {
            const cfg = SECTION_MAP[s] || { type: 'APTITUDE', roleSpecific: false };
            return questionsApi.getSession({
              questionType: cfg.type,
              roleTag: cfg.roleSpecific ? roleTag : undefined,
              count: perSection,
            });
          })
        );

        let combined = [];
        batches.forEach(b => { if (b.status === 'fulfilled') combined = combined.concat(b.value.questions || []); });
        // de-dupe by id in case sections overlapped on the same type
        const seen = new Set();
        combined = combined.filter(q => (seen.has(q.id) ? false : (seen.add(q.id), true)));

        if (cancelled) return;
        if (combined.length === 0) {
          setLoadError('No practice questions are available for this test yet.');
        } else {
          setQuestions(shuffle(combined));
          setSecondsLeft((found.duration || 30) * 60);
        }
      } catch (err) {
        if (!cancelled) setLoadError(err?.message || 'Could not load this test.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [testId]);

  const handleSubmit = useCallback(async () => {
    if (!questions || submitting || results) return;
    setSubmitting(true);
    try {
      const checks = await Promise.allSettled(
        questions.map(q => {
          const ans = answers[q.id];
          if (!ans || !ans.trim()) return Promise.resolve(null);
          return questionsApi.checkAnswer(q.id, ans);
        })
      );
      let score = 0;
      let attempted = 0;
      const perQuestion = questions.map((q, i) => {
        const c = checks[i];
        const res = c.status === 'fulfilled' ? c.value : null;
        if (res) { attempted += 1; if (res.correct) score += 1; }
        return { question: q, userAnswer: answers[q.id] || '', result: res };
      });
      setResults({ score, attempted, total: questions.length, perQuestion });
    } catch (err) {
      toast({ title: 'Could not submit test', description: err?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }, [questions, answers, submitting, results, toast]);

  // Countdown timer, auto-submits at zero
  useEffect(() => {
    if (secondsLeft === null || results) return;
    if (secondsLeft <= 0) { handleSubmit(); return; }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, results, handleSubmit]);

  const mm = secondsLeft !== null ? Math.floor(secondsLeft / 60) : 0;
  const ss = secondsLeft !== null ? secondsLeft % 60 : 0;

  const q = questions?.[current];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Preparing your test...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center px-4">
        <p className="text-gray-600 mb-4">{loadError}</p>
        <Link to="/mock-tests"><Button variant="outline">Back to Mock Tests</Button></Link>
      </div>
    );
  }

  // ── Results screen ──────────────────────────────────────────────
  if (results) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{test.title} — Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Score: <span className="font-bold">{results.score}</span> / {results.attempted} attempted
              <span className="text-gray-500"> ({results.total - results.attempted} skipped)</span>
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results.perQuestion.map(({ question, userAnswer, result }, i) => (
            <Card key={question.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-medium">{i + 1}. {question.questionText}</p>
                  {result && (
                    result.correct
                      ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      : <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">Your answer: {userAnswer || <em>skipped</em>}</p>
                {result?.correctAnswer && <p className="text-sm"><span className="font-semibold">Answer:</span> {result.correctAnswer}</p>}
                {result?.explanation && (
                  <p className="text-sm text-gray-600 flex gap-2 mt-1">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" /> {result.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Link to="/mock-tests"><Button variant="outline">Back to Mock Tests</Button></Link>
        </div>
      </div>
    );
  }

  // ── Question-taking screen ──────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/mock-tests" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
          <ArrowLeft className="w-4 h-4" /> Exit Test
        </Link>
        <div className="flex items-center gap-2 font-mono text-sm bg-gray-100 rounded-full px-3 py-1">
          <Clock className="w-4 h-4" /> {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </div>
      </div>

      <h1 className="text-xl font-bold mb-1">{test.title}</h1>
      <p className="text-gray-500 text-sm mb-4">Question {current + 1} of {questions.length}</p>
      <Progress value={((current + 1) / questions.length) * 100} className="mb-6" />

      {q && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle className="text-base font-semibold leading-snug">{q.questionText}</CardTitle>
              <div className="flex gap-2 shrink-0">
                {q.difficulty && <Badge variant="secondary">{q.difficulty}</Badge>}
                {q.topic && <Badge variant="outline">{q.topic}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {Array.isArray(q.options) && q.options.length > 0 ? (
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer text-sm ${
                      answers[q.id] === opt ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[110px]"
                placeholder="Type your answer / approach here..."
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              />
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>
          Previous
        </Button>
        <div className="flex gap-2">
          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent(c => c + 1)}>Next</Button>
          ) : null}
          <Button
            className="bg-black hover:bg-gray-800"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockTestRunner;
