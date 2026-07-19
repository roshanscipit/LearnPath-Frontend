import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

// Renders Google's official "Sign in with Google" button and handles
// the ID-token exchange with our backend (/api/auth/google).
const GoogleSignInButton = ({ text = 'continue_with' }) => {
  const btnRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn('REACT_APP_GOOGLE_CLIENT_ID is not set — Google sign-in is disabled.');
      return;
    }

    const handleCredentialResponse = async (response) => {
      try {
        const data = await authApi.googleSignIn(response.credential);
        login(data.token, data.user);
        toast({ title: 'Welcome!', description: `Signed in as ${data.user.name}` });
        navigate('/dashboard');
      } catch (err) {
        toast({ title: 'Google sign-in failed', description: err.message, variant: 'destructive' });
      }
    };

    const initializeGoogle = () => {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text,
      });
    };

    // The GSI script loads async — poll briefly until it's ready
    if (window.google) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [login, navigate, toast, text]);

  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    return null; // Hide silently if not configured, rather than showing a broken button
  }

  return <div ref={btnRef} className="w-full flex justify-center" />;
};

export default GoogleSignInButton;
