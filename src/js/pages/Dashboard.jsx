import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Target, TrendingUp, Award, Lock, CheckCircle, Clock, BookOpen, Loader2 } from 'lucide-react';
import { learningModules, userProgress as fallbackProgress } from '../mock/mockData';
import { progressApi } from '../services/api';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(fallbackProgress);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await progressApi.get();
        setProgress(data);
      } catch {
        // backend down – keep fallback mock data
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const completedModulesCount = (progress.completedModules || []).length;
  const totalModulesCount = learningModules.length;

  const getModuleStatus = (moduleId) => {
    const completed = progress.completedModules || [];
    if (completed.includes(moduleId)) return 'completed';
    if (moduleId === progress.currentModule) return 'current';
    const moduleOrder = learningModules.find(m => m.id === moduleId)?.order || 0;
    const currentOrder = learningModules.find(m => m.id === progress.currentModule)?.order || 0;
    return moduleOrder <= currentOrder ? 'unlocked' : 'locked';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Welcome back, {user?.name || 'Learner'}!</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3"><CardDescription className="text-sm">Overall Progress</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold">{progress.overallProgress}%</span>
                <Target className="w-8 h-8 text-black" />
              </div>
              <Progress value={progress.overallProgress} className="h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription className="text-sm">Modules Completed</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{completedModulesCount}/{totalModulesCount}</span>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription className="text-sm">Tests Taken</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{progress.testsTaken}</span>
                <Award className="w-8 h-8 text-black" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription className="text-sm">Average Score</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{progress.averageScore}%</span>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Learning Path */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Your Learning Path</h2>
          <Card className="bg-gradient-to-r from-black to-gray-800 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">{(progress.selectedRole || 'java').toUpperCase()} – {progress.selectedVariant || 'Full Stack'}</CardTitle>
              <CardDescription className="text-gray-300">Sequential module completion required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Current Module</p>
                  <p className="text-xl font-semibold">{learningModules.find(m => m.id === progress.currentModule)?.name || 'Aptitude'}</p>
                </div>
                <Link to="/learning-path"><Button variant="secondary">Continue Learning</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Learning Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map((module) => {
              const status = getModuleStatus(module.id);
              const IconComponent = status === 'completed' ? CheckCircle : status === 'current' ? BookOpen : status === 'unlocked' ? Clock : Lock;
              return (
                <Card key={module.id} className={`relative ${status === 'locked' ? 'opacity-60' : 'hover:shadow-lg transition-shadow cursor-pointer'}`}
                  onClick={() => status !== 'locked' && navigate('/learning-path')}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                        {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : status === 'unlocked' ? 'Unlocked' : 'Locked'}
                      </Badge>
                      <IconComponent className={`w-5 h-5 ${status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <CardTitle>{module.name}</CardTitle>
                    <CardDescription>{module.duration} • {module.questionsCount} questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.topics.slice(0, 3).map((topic, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-black rounded-full mr-2"></div>{topic}
                        </div>
                      ))}
                      {module.topics.length > 3 && <p className="text-sm text-gray-500">+{module.topics.length - 3} more topics</p>}
                    </div>
                  </CardContent>
                  {status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-600">Complete previous modules to unlock</p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-black">
            <CardHeader><CardTitle>Take a Mock Test</CardTitle><CardDescription>Practice with timed assessments</CardDescription></CardHeader>
            <CardContent><Link to="/mock-tests"><Button className="w-full bg-black hover:bg-gray-800">Browse Mock Tests</Button></Link></CardContent>
          </Card>
          <Card className="border-2 border-black">
            <CardHeader><CardTitle>Explore Companies</CardTitle><CardDescription>Company-specific preparation</CardDescription></CardHeader>
            <CardContent><Link to="/companies"><Button className="w-full bg-black hover:bg-gray-800">View Companies</Button></Link></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
