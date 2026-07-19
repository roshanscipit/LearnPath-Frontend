import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialogue';
import { Calendar } from '../components/ui/calender';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { UserCheck, Award, CheckCircle, Calendar as CalendarIcon, FileText, Building, Loader2 } from 'lucide-react';
import { paidServices } from '../mock/mockData';
import { useToast } from '../hooks/use-toast';
import { bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const iconMap = { UserCheck, Award, FileText, Building };

const timeSlots = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM'];

const PaidServices = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingService, setBookingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const confirmBooking = async () => {
    if (!selectedTime) {
      toast({ title: 'Error', description: 'Please select a time slot', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // Format date as YYYY-MM-DD for the backend
      const dateStr = selectedDate.toISOString().split('T')[0];

      if (user) {
        // Authenticated – save to backend
        await bookingsApi.create(
          bookingService.id,
          bookingService.name,
          bookingService.price,
          dateStr,
          selectedTime
        );
        toast({ title: '🎉 Booking Confirmed!', description: `${bookingService.name} scheduled for ${selectedDate.toDateString()} at ${selectedTime}` });
      } else {
        // Not logged in – show demo confirmation
        toast({ title: 'Booking Confirmed! (Preview)', description: `Sign in to save bookings. ${bookingService.name} on ${selectedDate.toDateString()} at ${selectedTime}` });
      }
      setBookingService(null);
      setSelectedTime('');
    } catch (err) {
      toast({ title: 'Booking failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Premium Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get personalized guidance from industry experts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {paidServices.map((service) => {
            const Icon = iconMap[service.icon] || Award;
            return (
              <Card key={service.id} className="border-2 hover:border-black transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="w-16 h-16 bg-black text-white rounded-lg flex items-center justify-center mb-4"><Icon className="w-8 h-8" /></div>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">₹{service.price}</span>
                      <span className="text-gray-500 ml-2">/ {service.duration}</span>
                    </div>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Dialog open={bookingService?.id === service.id} onOpenChange={(open) => !open && setBookingService(null)}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-black hover:bg-gray-800" size="lg" onClick={() => setBookingService(service)}>
                          <CalendarIcon className="w-4 h-4 mr-2" />Schedule Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Schedule {service.name}</DialogTitle>
                          <DialogDescription>Select your preferred date and time slot</DialogDescription>
                        </DialogHeader>
                        <div className="grid md:grid-cols-2 gap-6 py-4">
                          <div>
                            <h4 className="font-semibold mb-3">Select Date</h4>
                            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate}
                              disabled={(date) => date < new Date() || date.getDay() === 0} className="rounded-md border" />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">Select Time</h4>
                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                              <SelectTrigger><SelectValue placeholder="Choose time slot" /></SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((slot) => (<SelectItem key={slot} value={slot}>{slot}</SelectItem>))}
                              </SelectContent>
                            </Select>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-semibold mb-2">Booking Summary</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Service:</strong> {service.name}</p>
                                <p><strong>Duration:</strong> {service.duration}</p>
                                <p><strong>Price:</strong> ₹{service.price}</p>
                                {selectedTime && <p><strong>Time:</strong> {selectedDate.toDateString()} at {selectedTime}</p>}
                              </div>
                            </div>

                            <Button className="w-full mt-4 bg-black hover:bg-gray-800" onClick={confirmBooking} disabled={submitting}>
                              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Booking...</> : user ? 'Confirm Booking' : 'Confirm Booking (Preview)'}
                            </Button>
                            {!user && <p className="text-xs text-center text-gray-500 mt-2">Sign in to save your booking</p>}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-black to-gray-800 text-white">
          <CardHeader><CardTitle className="text-2xl">Why Choose Our Premium Services?</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[['Expert Mentors','Learn from professionals at top companies with 5+ years of experience.'],
                ['Personalized Feedback','Get detailed insights on your performance and areas of improvement.'],
                ['Flexible Scheduling','Book sessions at your convenience with easy rescheduling options.']
              ].map(([title, desc]) => (
                <div key={title}><h4 className="font-semibold mb-2">{title}</h4><p className="text-sm text-gray-300">{desc}</p></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaidServices;
