import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, IndianRupee, Briefcase, Users, Loader2 } from 'lucide-react';
import { companies as fallbackCompanies, learningModules } from '../mock/mockData';
import { companiesApi } from '../services/api';

const getDifficultyColor = (d) => ({ Easy: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', Hard: 'bg-red-100 text-red-800' }[d] || 'bg-gray-100 text-gray-800');

const CompanyDetail = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await companiesApi.getById(companyId);
        setCompany(data);
      } catch {
        setCompany(fallbackCompanies.find(c => c.id === companyId) || null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [companyId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>;

  if (!company) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600">Company not found</p>
        <Link to="/companies" className="text-black hover:underline mt-4 inline-block">Back to Companies</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/companies" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Companies
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">{company.name}</h1>
          <Badge className={getDifficultyColor(company.difficulty)}>{company.difficulty} Level</Badge>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3"><CardDescription>Salary Range (INR)</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center">
                <IndianRupee className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold">{(company.salaryRange.min/100000).toFixed(1)}L – {(company.salaryRange.max/100000).toFixed(1)}L</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription>Open Positions</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center"><Briefcase className="w-6 h-6 text-blue-600 mr-2" /><span className="text-2xl font-bold">{company.openPositions}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardDescription>Interview Rounds</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center"><Users className="w-6 h-6 text-purple-600 mr-2" /><span className="text-2xl font-bold">{company.hiringProcess.length}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Hiring Process */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="text-2xl">Hiring Process</CardTitle><CardDescription>Step-by-step interview process for {company.name}</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-6">
              {company.hiringProcess.map((round, index) => (
                <div key={index} className="relative">
                  {index < company.hiringProcess.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-12 bg-gray-300 z-0"></div>}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 z-10">{round.step}</div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">{round.name}</h4>
                        <Badge variant="outline" className="flex items-center"><Clock className="w-3 h-3 mr-1" />{round.duration}</Badge>
                      </div>
                      <p className="text-gray-600">{round.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-8">
          <CardHeader><CardTitle className="text-2xl">Requirements</CardTitle><CardDescription>Key skills and qualifications needed</CardDescription></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {company.requirements.map((req, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" /><span className="text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prep Modules */}
        <Card>
          <CardHeader><CardTitle className="text-2xl">Recommended Preparation Path</CardTitle><CardDescription>Master these modules to excel in {company.name} interviews</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {learningModules.map((module, index) => (
                <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">{index + 1}</div>
                    <div><h4 className="font-semibold">{module.name}</h4><p className="text-sm text-gray-600">{module.questionsCount} questions</p></div>
                  </div>
                  <Link to="/learning-path"><Button variant="outline" size="sm">Start Module</Button></Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetail;
