import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [mobileForm, setMobileForm] = useState({ mobile: '', otp: '' });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authApi.loginEmail(emailForm.email, emailForm.password);
      login(data.token, data.user);
      toast({ title: 'Welcome back!', description: `Logged in as ${data.user.name}` });
      navigate('/dashboard');
    } catch (err) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const mobile = mobileForm.mobile.replace(/\D/g, '');
    if (mobile.length < 10) {
      toast({ title: 'Error', description: 'Enter a valid 10-digit mobile number', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await authApi.sendOtp(mobile);
      setOtpSent(true);
      toast({ title: 'OTP Sent!', description: `OTP sent to +91 ${mobile}` });
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mobile = mobileForm.mobile.replace(/\D/g, '');
      const data = await authApi.verifyOtp(mobile, mobileForm.otp);
      setOtpVerified(true);
      login(data.token, data.user);
      toast({ title: 'Welcome!', description: 'Logged in successfully' });
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (err) {
      toast({ title: 'Invalid OTP', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-gray-800 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-1">
            <img src="/doliuw-logo.png" alt="Doliuw" className="h-24 w-auto object-contain drop-shadow-xl" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">Sign in to continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <GoogleSignInButton text="continue_with" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium tracking-wider">Or continue with</span>
            </div>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-5 bg-gray-100">
              <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mail className="w-4 h-4 mr-2" />Email
              </TabsTrigger>
              <TabsTrigger value="mobile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Phone className="w-4 h-4 mr-2" />Mobile OTP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })} required className="mt-1.5 h-11" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors">Forgot password?</a>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })} required className="h-11" />
                </div>
                <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 font-medium" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : 'Sign In'}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{' '}<a href="/signup" className="text-black font-semibold hover:underline">Sign up free</a>
              </p>
            </TabsContent>

            <TabsContent value="mobile">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Mobile Number</Label>
                    <div className="flex mt-1.5">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">+91</span>
                      <Input type="tel" placeholder="9876543210" value={mobileForm.mobile}
                        onChange={(e) => setMobileForm({ ...mobileForm, mobile: e.target.value })}
                        required className="rounded-l-none h-11" maxLength={10} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 font-medium" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending OTP...</> : 'Send OTP'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800">OTP sent to +91 {mobileForm.mobile}</p>
                      <p className="text-xs text-green-600 mt-0.5">Enter the 6-digit OTP below</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Enter 6-digit OTP</Label>
                    <Input type="text" placeholder="• • • • • •" value={mobileForm.otp}
                      onChange={(e) => setMobileForm({ ...mobileForm, otp: e.target.value.replace(/\D/g, '') })}
                      required className="mt-1.5 h-11 text-center text-lg tracking-[0.5em] font-mono" maxLength={6} autoFocus />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-800 font-medium" disabled={loading || otpVerified}>
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</>
                      : otpVerified ? <><CheckCircle2 className="w-4 h-4 mr-2" />Verified!</> : 'Verify OTP'}
                  </Button>
                  <button type="button" className="w-full text-sm text-gray-500 hover:text-black transition-colors underline-offset-2 hover:underline"
                    onClick={() => { setOtpSent(false); setMobileForm({ mobile: '', otp: '' }); }}>
                    Use a different number
                  </button>
                </form>
              )}
              <p className="mt-4 text-center text-sm text-gray-500">
                Don't have an account?{' '}<a href="/signup" className="text-black font-semibold hover:underline">Sign up free</a>
              </p>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-gray-400 pt-1">
            By signing in, you agree to our <a href="#" className="underline hover:text-gray-600">Terms</a>{' '}and{' '}
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
