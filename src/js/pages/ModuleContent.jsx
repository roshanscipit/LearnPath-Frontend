import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { roles as fallbackRoles } from '../mock/mockData';
import { rolesApi, questionsApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

// Maps a Learning Path module id to the backend's questionType, and whether
// it needs a role tag (role-specific) or is shared/common across all roles.
const MODULE_CONFIG = {
  aptitude: { questionType: 'APTITUDE', roleSpecific: false, label: 'Aptitude' },
  coding: { questionType: 'CODING', roleSpecific: true, label: 'Coding' },
  technical: { questionType: 'MIXED', roleSpecific: false, label: 'Technical' },
  'system-design': { questionType: 'SYSTEM_DESIGN', roleSpecific: true, label: 'System Design' },
  behavioral: { questionType: 'BEHAVIORAL', roleSpecific: true, label: 'Behavioral' },
};

const ModuleContent = () => {
  const { roleId, moduleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [roles, setRoles] = useState(fallbackRoles);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Per-question interaction state, keyed by question id
  const [selected, setSelected] = useState({});      // { [id]: chosen option or typed text }
  const [results, setResults] = useState({});         // { [id]: { correct, correctAnswer, explanation } }
  const [checking, setChecking] = useState({});       // { [id]: bool }

  const config = MODULE_CONFIG[moduleId];
  const role = roles.find(r => r.id === roleId);

  useEffect(() => {
    rolesApi.getAll().then(setRoles).catch(() => {});
  }, []);

  const loadSession = useCallback(() => {
    if (!config) return;
    setLoading(true);
    setErrorMsg(null);
    setSelected({});
    setResults({});
    questionsApi.getSession({
      questionType: config.questionType,
      roleTag: config.roleSpecific ? roleId : undefined,
      count: 10,
    })
      .then((session) => setQuestions(session.questions || []))
      .catch((err) => setErrorMsg(err?.message || 'Could not load questions for this module yet.'))
      .finally(() => setLoading(false));
  }, [config, roleId]);

  useEffect(() => { loadSession(); }, [loadSession]);

  const handleCheck = async (q) => {
    const answer = selected[q.id];
    if (!answer || !answer.trim()) {
      toast({ title: 'Enter or select an answer first', variant: 'destructive' });
      return;
    }
    setChecking(prev => ({ ...prev, [q.id]: true }));
    try {
      const res = await questionsApi.checkAnswer(q.id, answer);
      setResults(prev => ({ ...prev, [q.id]: res }));
    } catch (err) {
      toast({ title: 'Could not check answer', description: err?.message, variant: 'destructive' });
    } finally {
      setChecking(prev => ({ ...prev, [q.id]: false }));
    }
  };

  if (!config) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-gray-600 mb-4">Unknown module.</p>
        <Link to={`/role/${roleId}`}><Button variant="outline">Back to Learning Path</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/role/${roleId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Learning Path
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {role?.name || roleId} &middot; {config.label}
          </h1>
          <p className="text-gray-500 mt-1">
            {config.roleSpecific
              ? `Practice questions tailored to the ${role?.name || roleId} role.`
              : `Shared ${config.label.toLowerCase()} practice questions.`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadSession} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> New set
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading questions...
        </div>
      )}

      {!loading && errorMsg && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-gray-500">
            <p>{errorMsg}</p>
            <p className="text-sm mt-2">This module's question bank for this role may still be filling in — check back soon.</p>
          </CardContent>
        </Card>
      )}

      {!loading && !errorMsg && questions && questions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-gray-500">
            No questions available for this module yet.
          </CardContent>
        </Card>
      )}

      {!loading && !errorMsg && questions && questions.length > 0 && (
        <div className="space-y-5">
          {questions.map((q, idx) => {
            const result = results[q.id];
            const hasOptions = Array.isArray(q.options) && q.options.length > 0;
            return (
              <Card key={q.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base font-semibold leading-snug">
                      {idx + 1}. {q.questionText}
                    </CardTitle>
                    <div className="flex gap-2 shrink-0">
                      {q.difficulty && <Badge variant="secondary">{q.difficulty}</Badge>}
                      {q.topic && <Badge variant="outline">{q.topic}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {hasOptions ? (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer text-sm ${
                            selected[q.id] === opt ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            checked={selected[q.id] === opt}
                            onChange={() => setSelected(prev => ({ ...prev, [q.id]: opt }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[90px]"
                      placeholder="Type your answer / approach here..."
                      value={selected[q.id] || ''}
                      onChange={(e) => setSelected(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <Button size="sm" onClick={() => handleCheck(q)} disabled={checking[q.id]}>
                      {checking[q.id] ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                      Check Answer
                    </Button>
                    {result && (
                      <span className={`inline-flex items-center gap-1 text-sm font-medium ${result.correct ? 'text-green-600' : 'text-amber-600'}`}>
                        {result.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {result.correct ? 'Correct' : 'See explanation'}
                      </span>
                    )}
                  </div>

                  {result && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 space-y-2">
                      {result.correctAnswer && (
                        <p><span className="font-semibold">Answer / approach:</span> {result.correctAnswer}</p>
                      )}
                      {result.explanation && (
                        <p className="flex gap-2">
                          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                          <span>{result.explanation}</span>
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModuleContent;
