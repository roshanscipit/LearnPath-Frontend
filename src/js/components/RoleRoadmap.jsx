import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ChevronDown, ChevronUp, Loader2, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { roadmapApi } from '../services/api';

// Displays the detailed, role-specific curriculum for a given role:
// levels (Basic/Intermediate/Advanced) -> topics -> key points + interview Q&A.
// Backed by GET /api/roadmap/{moduleId}.
const RoleRoadmap = ({ roleId }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openTopicId, setOpenTopicId] = useState(null);

  useEffect(() => {
    if (!roleId) return;
    let cancelled = false;

    setLoading(true);
    setError(false);
    setRoadmap(null);

    roadmapApi.getByRole(roleId)
      .then((data) => { if (!cancelled) setRoadmap(data); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [roleId]);

  const toggleTopic = (topicId) => {
    setOpenTopicId((prev) => (prev === topicId ? null : topicId));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 flex items-center justify-center text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading roadmap...
        </CardContent>
      </Card>
    );
  }

  // No roadmap authored for this role yet, or the request failed — fail quietly.
  if (error || !roadmap || !roadmap.levels?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6" /> {roadmap.moduleName} Roadmap
        </CardTitle>
        <CardDescription>
          Curated topics, key points, and interview Q&amp;A across all difficulty levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={roadmap.levels[0]?.level}>
          <TabsList>
            {roadmap.levels.map((lvl) => (
              <TabsTrigger key={lvl.level} value={lvl.level}>{lvl.level}</TabsTrigger>
            ))}
          </TabsList>

          {roadmap.levels.map((lvl) => (
            <TabsContent key={lvl.level} value={lvl.level} className="space-y-3 mt-4">
              {lvl.topics.map((topic) => {
                const isOpen = openTopicId === topic.id;
                return (
                  <div key={topic.id} className="border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleTopic(topic.id)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <div>
                        <p className="font-semibold text-black">{topic.title}</p>
                        <p className="text-sm text-gray-600">{topic.summary}</p>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-3" />
                                : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-3" />}
                    </button>

                    {isOpen && (
                      <div className="p-4 space-y-4">
                        {topic.keyPoints?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Points</h4>
                            <ul className="space-y-1">
                              {topic.keyPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <div className="w-1.5 h-1.5 bg-black rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {topic.interviewQA?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
                              <MessageCircleQuestion className="w-4 h-4" /> Interview Q&amp;A
                            </h4>
                            <div className="space-y-3">
                              {topic.interviewQA.map((qa, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-md p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-black">{qa.question}</p>
                                    {qa.difficulty && (
                                      <Badge variant="outline" className="ml-2 flex-shrink-0">{qa.difficulty}</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{qa.modelAnswer}</p>
                                  {qa.tip && (
                                    <p className="text-xs text-gray-500 italic mt-2">💡 {qa.tip}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RoleRoadmap;
