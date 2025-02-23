import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import Chat from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { useState, useEffect } from 'react';
import { LoginPopup } from '~/components/auth/LoginPopup';
import { useSearchParams, useNavigate } from "@remix-run/react";
import { toast } from "react-toastify";
import { supabase } from '~/lib/supabase';

export const meta: MetaFunction = () => {
  return [{ title: 'codeiq' }, { name: 'description', content: 'Talk with codeiq, an AI assistant from Thomas' }];
};

export const loader = () => json({});

export default function Index() {
  const [searchParams] = useSearchParams();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // ✅ Remove hash and trailing slashes from URL
    if (window.location.hash || window.location.pathname.endsWith('/')) {
      const cleanPath = window.location.pathname.replace(/[#/]+$/, '');
      window.history.replaceState({}, '', cleanPath);
    }
    
    const error = searchParams.get("error");
    const login = searchParams.get("login");
    
    if (error === "github_auth_failed") {
      toast.error("GitHub login failed. Please try again.");
    }
    
    if (login === "success") {
      toast.success("Successfully logged in!");
      window.history.replaceState({}, '', window.location.pathname.replace(/[#/]+$/, ''));
    }

    // ✅ Manually fetch session & trigger UI update
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        window.dispatchEvent(new Event('auth-change'));
      }
    };

    fetchSession();
  }, [searchParams]);

  useEffect(() => {
    // ✅ Listen for 'auth-change' event to update UI
    const handleAuthChange = () => {
      setShowLoginPopup(false);
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header setShowLoginPopup={setShowLoginPopup} />
      <ClientOnly fallback={<BaseChat imageDataList={[]} uploadedFiles={[]} />}>
        {() => (
          <>
            {showLoginPopup && (
              <LoginPopup
                onSuccess={() => setShowLoginPopup(false)}
                onClose={() => setShowLoginPopup(false)}
              />
            )}
            <Chat showLoginPopup={showLoginPopup} setShowLoginPopup={setShowLoginPopup} />
          </>
        )}
      </ClientOnly>
    </div>
  );
}
