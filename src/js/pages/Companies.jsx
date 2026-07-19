import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Sparkles, Briefcase, Rocket, Building2, TrendingUp, IndianRupee, Loader2 } from 'lucide-react';
import { companies as fallbackCompanies, companyCategories } from '../mock/mockData';
import { companiesApi } from '../services/api';

const categoryIcons = { product: Sparkles, service: Briefcase, startup: Rocket };

const getDifficultyColor = (d) => ({ Easy: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', Hard: 'bg-red-100 text-red-800' }[d] || 'bg-gray-100 text-gray-800');

const Companies = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [companies, setCompanies] = useState(fallbackCompanies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await companiesApi.getAll(selectedCategory);
        setCompanies(data);
      } catch {
        setCompanies(selectedCategory === 'all' ? fallbackCompanies : fallbackCompanies.filter(c => c.category === selectedCategory));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Company Preparation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Detailed insights on hiring process, salary, and requirements for top companies</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <Button variant={selectedCategory === 'all' ? 'default' : 'outline'} onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'bg-black' : ''}>
            All Companies
          </Button>
          {companyCategories.map((cat) => {
            const Icon = categoryIcons[cat.id];
            return (
              <Button key={cat.id} variant={selectedCategory === cat.id ? 'default' : 'outline'} onClick={() => setSelectedCategory(cat.id)} className={selectedCategory === cat.id ? 'bg-black' : ''}>
                <Icon className="w-4 h-4 mr-2" />{cat.name}
              </Button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const Icon = categoryIcons[company.category] || Building2;
              return (
                <Card key={company.id} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-600" />
                      </div>
                      <Badge className={getDifficultyColor(company.difficulty)}>{company.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-2xl">{company.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />{companyCategories.find(c => c.id === company.category)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-1 text-green-600" /><span className="text-sm font-semibold">Salary Range</span></div>
                        <span className="text-sm font-bold">{(company.salaryRange.min/100000).toFixed(1)}L – {(company.salaryRange.max/100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-blue-600" /><span className="text-sm font-semibold">Open Positions</span></div>
                        <span className="text-sm font-bold">{company.openPositions}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Interview Rounds:</p>
                        <p className="text-sm text-gray-600">{company.hiringProcess.length} rounds</p>
                      </div>
                      <Link to={`/company/${company.id}`}>
                        <Button className="w-full bg-black hover:bg-gray-800">View Details</Button>
                      </Link>
                    </div>
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

export default Companies;
