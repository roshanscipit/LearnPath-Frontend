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

const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [mobileForm, setMobileForm] = useState({ mobile: '', otp: '' });

  const handleGoogleLogin = () => {
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

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
          <Button onClick={handleGoogleLogin} className="w-full bg-white text-gray-800 hover:bg-gray-50 border border-gray-300 shadow-sm font-medium" size="lg">
            <GoogleIcon className="w-5 h-5 mr-3" />Continue with Google
          </Button>

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
