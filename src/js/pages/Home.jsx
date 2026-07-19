import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, CheckCircle, Target, TrendingUp, Users } from 'lucide-react';
import { roles, companyCategories } from '../mock/mockData';

const Home = () => {
  const stats = [
    { icon: Users, label: 'Active Learners', value: '50K+' },
    { icon: Target, label: 'Companies Covered', value: '200+' },
    { icon: TrendingUp, label: 'Success Rate', value: '85%' },
    { icon: CheckCircle, label: 'Mock Tests', value: '1000+' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master Your Interview
              <span className="block mt-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Journey Starts Here
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Structured learning paths, company-specific preparation, and expert guidance to land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/roles">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6">
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/mock-tests">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6">
                  Try Mock Test
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-lg mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Doliuw App?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to crack your dream company interview
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-black transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Structured Learning Paths</h3>
              <p className="text-gray-600">
                Role-specific preparation tracks with sequential modules. Complete one to unlock the next.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-black transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Company-Specific Prep</h3>
              <p className="text-gray-600">
                Detailed hiring process, salary insights, and requirements for 200+ companies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-black transition-all hover:shadow-lg">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Expert Mentorship</h3>
              <p className="text-gray-600">
                One-on-one mock interviews and guidance from industry professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have successfully cracked their dream company interviews.
          </p>
          <Link to="/roles">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;