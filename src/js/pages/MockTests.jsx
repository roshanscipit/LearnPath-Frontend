import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Clock, FileText, Award, Play, Loader2 } from 'lucide-react';
import { mockTests as fallbackTests } from '../mock/mockData';
import { mockTestsApi } from '../services/api';
import { useToast } from '../hooks/use-toast';

const getDifficultyColor = (d) => ({ Easy: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', Hard: 'bg-red-100 text-red-800' }[d] || 'bg-gray-100 text-gray-800');

const MockTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('free');
  const [tests, setTests] = useState(fallbackTests);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockTestsApi.getAll()
      .then(setTests)
      .catch(() => setTests(fallbackTests))
      .finally(() => setLoading(false));
  }, []);

  const freeTests = tests.filter(t => t.type === 'free');

  const handleStartTest = (test) => {
    toast({ title: `Starting: ${test.title}`, description: `${test.questions} questions · ${test.duration} mins · ${test.difficulty}` });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Mock Tests</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Practice with timed assessments and track your performance</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {['free', 'premium'].map(tab => (
            <Button key={tab} variant={activeTab === tab ? 'default' : 'outline'} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'bg-black' : ''}>
              {tab === 'free' ? 'Free Tests' : 'Premium Tests'}
            </Button>
          ))}
        </div>

        {activeTab === 'free' && (
          loading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-black" /></div> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeTests.map((test) => (
                <Card key={test.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center"><FileText className="w-6 h-6" /></div>
                      <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-xl">{test.title}</CardTitle>
                    <CardDescription>{test.sections.join(' • ')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          <div><p className="text-xs text-gray-500">Duration</p><p className="text-sm font-semibold">{test.duration} mins</p></div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 mr-2 text-green-600" />
                          <div><p className="text-xs text-gray-500">Questions</p><p className="text-sm font-semibold">{test.questions}</p></div>
                        </div>
                      </div>
                      <Button className="w-full bg-black hover:bg-gray-800" onClick={() => handleStartTest(test)}>
                        <Play className="w-4 h-4 mr-2" />Start Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}

        {activeTab === 'premium' && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-black">
              <CardHeader className="text-center">
                <Award className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <CardTitle className="text-3xl">Premium Mock Tests</CardTitle>
                <CardDescription className="text-lg">Company-specific mocks and detailed analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {['100+ company-specific mock tests', 'Detailed performance analytics and insights', 'Unlimited test attempts', 'Video solutions for all questions'].map((feat, i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">✓</div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-black hover:bg-gray-800" size="lg" onClick={() => navigate('/paid-services')}>View Premium Plans</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTests;
