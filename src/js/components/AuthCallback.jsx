import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        const hash = window.location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);

        if (!sessionIdMatch) throw new Error('No session ID found');

        const sessionId = sessionIdMatch[1];
        const data = await authApi.googleCallback(sessionId);

        login(data.token, data.user);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: 'Authentication Failed',
          description: 'Unable to complete sign in. Please try again.',
          variant: 'destructive',
        });
        navigate('/login', { replace: true });
      }
    };

    processSession();
  }, [navigate, toast, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
