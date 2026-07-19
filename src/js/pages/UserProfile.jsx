import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  User, Mail, Phone, Calendar, BookOpen, Award, Target,
  TrendingUp, CheckCircle, XCircle, Loader2, ArrowLeft, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { progressApi, bookingsApi } from '../services/api';
import { learningModules, userProgress as fallbackProgress } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState(fallbackProgress);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prog, bkgs] = await Promise.allSettled([
          progressApi.get(),
          bookingsApi.getMyBookings(),
        ]);
        if (prog.status === 'fulfilled') setProgress(prog.value);
        if (bkgs.status === 'fulfilled') setBookings(bkgs.value);
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsApi.cancel(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      toast({ title: 'Booking cancelled', description: 'Your booking has been cancelled successfully.' });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const completedCount = (progress.completedModules || []).length;
  const totalCount = learningModules.length;

  const getStatusColor = (status) => ({
    CONFIRMED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
  }[status] || 'bg-gray-100 text-gray-800');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-black mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Account Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-black flex items-center justify-center">
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : <User className="w-10 h-10 text-white" />}
              </div>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mt-1 capitalize">{user?.provider?.toLowerCase() || 'email'}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {user?.email && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.mobile && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>+91 {user.mobile}</span>
                </div>
              )}
              <Link to="/learning-path" className="block mt-4">
                <Button className="w-full bg-black hover:bg-gray-800" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />Continue Learning
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardDescription className="text-xs">Overall Progress</CardDescription></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">{progress.overallProgress}%</span>
                  <Target className="w-7 h-7 text-black" />
                </div>
                <Progress value={progress.overallProgress} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardDescription className="text-xs">Modules Completed</CardDescription></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{completedCount}<span className="text-base text-gray-400">/{totalCount}</span></span>
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardDescription className="text-xs">Tests Taken</CardDescription></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{progress.testsTaken}</span>
                  <Award className="w-7 h-7 text-black" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardDescription className="text-xs">Average Score</CardDescription></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{progress.averageScore}%</span>
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Current Role */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Learning Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-black capitalize">{progress.selectedRole} Developer — {progress.selectedVariant}</p>
                <p className="text-sm text-gray-500 mt-1">Current module: <span className="font-medium capitalize">{progress.currentModule}</span></p>
              </div>
              <Link to="/roles">
                <Button variant="outline" size="sm">Change Role</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Completed Modules */}
        {(progress.completedModules || []).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Completed Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(progress.completedModules || []).map(moduleId => {
                  const m = learningModules.find(m => m.id === moduleId);
                  return m ? (
                    <div key={moduleId} className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />{m.name}
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">My Bookings</CardTitle>
              <Link to="/paid-services">
                <Button variant="outline" size="sm">Book a Service</Button>
              </Link>
            </div>
            <CardDescription>Your scheduled sessions and service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No bookings yet.</p>
                <Link to="/paid-services" className="text-black text-sm font-medium hover:underline mt-2 inline-block">
                  Book your first session →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{booking.serviceName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.bookingDate}</span>
                        <span>{booking.timeSlot}</span>
                        <span className="font-medium text-black">₹{booking.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      {booking.status === 'CONFIRMED' && (
                        <button onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                          title="Cancel booking">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
