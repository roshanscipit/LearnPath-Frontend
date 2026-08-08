import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Bot, Sparkles, Upload, FileText, X, Loader2, CheckCircle2, AlertTriangle,
  BookOpen, ClipboardList, MessageSquareText, Users, ArrowRight,
} from 'lucide-react';
import { roles as fallbackRoles } from '../mock/mockData';
import { rolesApi, careerAgentApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

const CareerAgent = () => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [roles, setRoles] = useState(fallbackRoles);
  const [targetRole, setTargetRole] = useState('');
  const [years, setYears] = useState('');
  const [notes, setNotes] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Load real roles list + any previously saved recommendation
  useEffect(() => {
    rolesApi.getAll().then(setRoles).catch(() => {});

    careerAgentApi.getSavedProfile()
      .then((saved) => {
        if (saved) {
          setResult(saved);
          setTargetRole(saved.targetRole || '');
          setYears(saved.yearsOfExperience != null ? String(saved.yearsOfExperience) : '');
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSaved(false));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx')) {
      toast({ title: 'Unsupported file', description: 'Please upload a PDF or DOCX resume.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Resume must be under 5MB.', variant: 'destructive' });
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetRole) {
      toast({ title: 'Pick a role', description: 'Select the role you\u2019re targeting first.', variant: 'destructive' });
      return;
    }
    if (years === '' || Number(years) < 0) {
      toast({ title: 'Years of experience', description: 'Enter a valid number of years (0 for freshers).', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await careerAgentApi.analyze({
        targetRole,
        yearsOfExperience: Number(years),
        additionalContext: notes,
        resumeFile,
      });
      setResult(data);
      toast({ title: '✅ Plan ready', description: 'Your personalized career plan has been generated.' });
    } catch (err) {
      setError(err.message || 'Something went wrong generating your plan.');
      toast({ title: 'Could not generate plan', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-black">AI Career Agent</h1>
            <p className="text-gray-600">Tell it your role and experience, optionally attach your resume, and get a personalized plan.</p>
          </div>
        </div>

        {/* Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>Used only to generate your plan — your resume is stored so you don't have to re-upload it next time.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target role</Label>
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger id="targetRole">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years">Years of experience</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g. 2"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anything else? (optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g. targeting fintech companies, weak at system design..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Resume (optional)</Label>
                {!resumeFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg py-6 flex flex-col items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
                  >
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Click to upload PDF or DOCX</span>
                    <span className="text-xs text-gray-400 mt-1">Max 5MB</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FileText className="w-4 h-4" /> {resumeFile.name}
                    </div>
                    <button type="button" onClick={() => setResumeFile(null)} className="text-gray-400 hover:text-black">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {result?.targetRole && !resumeFile && (
                  <p className="text-xs text-gray-500">A previously uploaded resume (if any) will still be used unless you attach a new one.</p>
                )}
              </div>

              <Button type="submit" size="lg" className="bg-black hover:bg-gray-800 w-full sm:w-auto" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating your plan...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Generate My Plan</>
                )}
              </Button>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Loading saved plan on first load */}
        {loadingSaved && !result && (
          <div className="flex items-center justify-center text-gray-400 py-10">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Checking for a saved plan...
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-black to-gray-800 text-white">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Your Plan
                  </CardTitle>
                  <Badge className="bg-white text-black">{result.suggestedLevel} level</Badge>
                </div>
                <CardDescription className="text-gray-300">{result.summary}</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(result.strengths || []).map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>{s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Gaps to close
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(result.gaps || []).map((g, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>{g}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommended courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Recommended courses
                </CardTitle>
                <CardDescription>Pulled straight from the {result.targetRole} roadmap.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {(result.recommendedCourses || []).map((c, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-black">{c.title}</p>
                        <Badge variant="outline">{c.level}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{c.reason}</p>
                    </div>
                  ))}
                </div>
                <Link to={`/role/${result.targetRole}`}>
                  <Button variant="outline" className="mt-4">
                    View full roadmap <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Next steps + feature recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" /> Next steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {(result.nextSteps || []).map((step, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="font-semibold text-black mr-2">{i + 1}.</span>{step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended next actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(result.recommendedMockTests || []).length > 0 && (
                    <div className="flex items-start gap-3 border rounded-lg p-3">
                      <ClipboardList className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">Take a mock test</p>
                        <p className="text-xs text-gray-500">{result.recommendedMockTests.join(', ')}</p>
                      </div>
                      <Link to="/mock-tests"><Button size="sm" variant="outline">Go</Button></Link>
                    </div>
                  )}

                  {result.aiInterviewRecommended && (
                    <div className="flex items-start gap-3 border rounded-lg p-3">
                      <MessageSquareText className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">Try an AI mock interview</p>
                        <p className="text-xs text-gray-500">Practice answering role-specific questions with instant feedback.</p>
                      </div>
                      <Link to="/dashboard"><Button size="sm" variant="outline">Go</Button></Link>
                    </div>
                  )}

                  {result.oneOnOneRecommended && (
                    <div className="flex items-start gap-3 border rounded-lg p-3 bg-gray-50">
                      <Users className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-black">Book a 1:1 expert session</p>
                        <p className="text-xs text-gray-500">{result.oneOnOneReason}</p>
                      </div>
                      <Link to="/paid-services"><Button size="sm" className="bg-black hover:bg-gray-800">Book</Button></Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAgent;
