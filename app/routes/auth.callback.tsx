import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { supabase } from '~/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/?error=auth_failed');
        return;
      }
      
      if (data?.session) {
        // Trigger auth change event to update UI
        window.dispatchEvent(new Event('auth-change'));
        navigate('/?login=success');
      } else {
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p>Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
} 