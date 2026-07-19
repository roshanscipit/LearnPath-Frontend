import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Code, Code2, Database, Cloud, TestTube2, Settings, BarChart, Smartphone, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { roles as fallbackRoles } from '../mock/mockData';
import { rolesApi } from '../services/api';

const iconMap = { Code, Code2, Database, Cloud, TestTube2, Settings, BarChart, Smartphone, Shield };

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(fallbackRoles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rolesApi.getAll()
      .then(setRoles)
      .catch(() => setRoles(fallbackRoles))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Choose Your Learning Path</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Select your role to get started with structured preparation modules</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = iconMap[role.icon] || Code;
              return (
                <Card key={role.id} className="border-2 hover:border-black transition-all cursor-pointer group hover:shadow-xl"
                  onClick={() => navigate(`/role/${role.id}`)}>
                  <CardHeader>
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 bg-black text-white group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <CardTitle className="text-2xl">{role.name}</CardTitle>
                    <CardDescription className="text-base">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {role.variants.map((variant, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-300">{variant}</span>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      Start Learning<ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;
