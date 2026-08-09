import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Lock, CheckCircle, Play, Calculator, Code, BookOpen, Network, Users, ArrowLeft, Loader2, Save } from 'lucide-react';
import { roles as fallbackRoles, learningModules, userProgress as fallbackProgress } from '../mock/mockData';
import { progressApi, rolesApi, roadmapApi } from '../services/api';
import { useToast } from '../hooks/use-toast';
import RoleRoadmap from '../components/RoleRoadmap';

const iconMap = { Calculator, Code, BookOpen, Network, Users };

// Aptitude & Behavioral are genuinely role-agnostic (same quant/verbal/STAR prep
// for everyone), so they always come from the shared generic list.
const COMMON_MODULE_IDS = ['aptitude', 'behavioral'];

// Flatten a role's curriculum levels into a compact topic list for the
// "Technical" module card (the full depth is still shown in RoleRoadmap below).
function technicalTopicsFromLevels(levels) {
  if (!Array.isArray(levels)) return null;
  const titles = levels.flatMap(l => (l.topics || []).map(t => t.title));
  return titles.length ? titles : null;
}

// Build the 5-module list for the currently selected role: common modules
// (Aptitude, Behavioral) come from shared mock data; Coding/Technical/System
// Design use the role's own roadmap JSON when available, and fall back to
// the old generic content for roles that don't have role-specific data yet.
function buildModules(roadmapDetail) {
  return learningModules.map((generic) => {
    if (COMMON_MODULE_IDS.includes(generic.id)) return generic;

    if (generic.id === 'coding' && roadmapDetail?.codingModule) {
      const m = roadmapDetail.codingModule;
      return { ...generic, duration: m.duration, questionsCount: m.questionsCount, topics: m.topics, focus: m.focus };
    }
    if (generic.id === 'system-design' && roadmapDetail?.systemDesignModule) {
      const m = roadmapDetail.systemDesignModule;
      return { ...generic, duration: m.duration, questionsCount: m.questionsCount, topics: m.topics, focus: m.focus };
    }
    if (generic.id === 'technical') {
      const topics = technicalTopicsFromLevels(roadmapDetail?.levels);
      if (topics) {
        return { ...generic, questionsCount: topics.length * 25, topics, focus: 'Full role-specific curriculum with key points and interview Q&A is below.' };
      }
    }
    return generic; // fallback: role has no specific content yet
  });
}

const LearningPath = () => {
  const { roleId } = useParams();
  const { toast } = useToast();
  const [progress, setProgress] = useState(fallbackProgress);
  const [roles, setRoles] = useState(fallbackRoles);
  const [roadmapDetail, setRoadmapDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load progress + roles from API
  useEffect(() => {
    const load = async () => {
      try {
        const [prog, roleList] = await Promise.allSettled([
          progressApi.get(),
          rolesApi.getAll(),
        ]);
        if (prog.status === 'fulfilled') setProgress(prog.value);
        if (roleList.status === 'fulfilled') setRoles(roleList.value);
      } catch (_) {
        // keep fallback data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectedRole = roles.find(r => r.id === roleId)
    || roles.find(r => r.id === progress.selectedRole)
    || roles[0];

  // Once we know which role is selected, fetch its roadmap JSON so the
  // Coding/Technical/System Design cards can show role-specific content.
  useEffect(() => {
    if (!selectedRole?.id) return;
    let cancelled = false;
    roadmapApi.getByRole(selectedRole.id)
      .then((data) => { if (!cancelled) setRoadmapDetail(data); })
      .catch(() => { if (!cancelled) setRoadmapDetail(null); });
    return () => { cancelled = true; };
  }, [selectedRole?.id]);

  const modules = buildModules(roadmapDetail);

  const getModuleStatus = (moduleId) => {
    const completed = progress.completedModules || [];
    if (completed.includes(moduleId)) return 'completed';
    if (moduleId === progress.currentModule) return 'current';
    const moduleOrder = modules.find(m => m.id === moduleId)?.order || 0;
    const currentOrder = modules.find(m => m.id === progress.currentModule)?.order || 0;
    return moduleOrder <= currentOrder ? 'unlocked' : 'locked';
  };

  // Mark a module as started / completed and save to backend
  const handleModuleAction = async (module, status) => {
    const completed = progress.completedModules || [];
    let newCompleted = [...completed];
    let newCurrent = progress.currentModule;

    if (status === 'current' || status === 'unlocked') {
      // Mark current module as completed, move to next
      if (!newCompleted.includes(module.id)) newCompleted.push(module.id);
      const nextModule = modules.find(m => m.order === module.order + 1);
      if (nextModule) newCurrent = nextModule.id;
    }

    const totalModules = modules.length;
    const newProgress = Math.round((newCompleted.length / totalModules) * 100);

    const updated = {
      ...progress,
      completedModules: newCompleted,
      currentModule: newCurrent,
      overallProgress: newProgress,
      selectedRole: selectedRole?.id || progress.selectedRole,
    };

    setProgress(updated);
    setSaving(true);

    try {
      await progressApi.update(updated);
      toast({ title: '✅ Progress saved!', description: `${module.name} marked as complete.` });
    } catch {
      toast({ title: 'Offline mode', description: 'Progress saved locally. Sync when backend is available.', variant: 'default' });
    } finally {
      setSaving(false);
    }
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
        <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{selectedRole?.name} Learning Path</h1>
              <p className="text-xl text-gray-600">{selectedRole?.description}</p>
            </div>
            {saving && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
              <span className="text-sm font-semibold text-gray-700">{progress.overallProgress}%</span>
            </div>
            <Progress value={progress.overallProgress} className="h-3" />
          </div>
        </div>

        {/* Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-black to-gray-800 text-white">
            <CardHeader>
              <CardTitle>Sequential Learning Path</CardTitle>
              <CardDescription className="text-gray-300">
                Complete modules in order. Each module unlocks only after completing the previous one.
                Progress is saved automatically to your profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {modules.map((module, index) => {
            const Icon = iconMap[module.icon] || BookOpen;
            const status = getModuleStatus(module.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';

            return (
              <div key={module.id} className="relative">
                {index < modules.length - 1 && (
                  <div className="absolute left-8 top-24 w-0.5 h-12 bg-gray-300 z-0"></div>
                )}

                <Card className={`relative z-10 ${isLocked ? 'opacity-60' : 'hover:shadow-xl transition-shadow'} ${isCurrent ? 'border-2 border-black' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-600' : isCurrent ? 'bg-black' : isLocked ? 'bg-gray-300' : 'bg-gray-800'} text-white`}>
                          {isCompleted ? <CheckCircle className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-2xl">{module.name}</CardTitle>
                            <Badge variant={isCompleted ? 'default' : isCurrent ? 'secondary' : 'outline'}>
                              {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : isLocked ? 'Locked' : 'Unlocked'}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">
                            {module.duration} • {module.questionsCount} Practice Questions
                          </CardDescription>
                        </div>
                      </div>

                      {!isLocked && (
                        <Button
                          className={isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-800'}
                          size="lg"
                          disabled={saving}
                          onClick={() => !isCompleted && handleModuleAction(module, status)}
                        >
                          {isCompleted ? 'Review' : isCurrent ? 'Mark Complete' : 'Start'}
                          {isCompleted ? <CheckCircle className="w-4 h-4 ml-2" /> : <Play className="w-4 h-4 ml-2" />}
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Topics Covered:</h4>
                        <ul className="space-y-1">
                          {module.topics.map((topic, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-black rounded-full mr-2"></div>{topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">What you'll learn:</h4>
                        <p className="text-sm text-gray-600">
                          {module.focus || `Master ${module.name.toLowerCase()} concepts through structured learning and practice. Complete ${module.questionsCount}+ questions to build strong foundations.`}
                        </p>
                      </div>
                    </div>

                    {isLocked && (
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg flex items-center">
                        <Lock className="w-5 h-5 text-gray-500 mr-3" />
                        <p className="text-sm font-semibold text-gray-600">
                          Complete "{modules[index - 1]?.name}" to unlock this module
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Role-specific curriculum: topics, key points, interview Q&A */}
        {selectedRole?.id && (
          <div className="mt-10">
            <RoleRoadmap roleId={selectedRole.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPath;
