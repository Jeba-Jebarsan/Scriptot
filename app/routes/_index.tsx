import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import Chat from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import BackgroundRays from '~/components/ui/BackgroundRays';
import { useState, useEffect } from 'react';
import { LoginPopup } from '~/components/auth/LoginPopup';
import { useSearchParams, useNavigate } from '@remix-run/react';
import { toast } from 'react-toastify';

export const meta: MetaFunction = () => {
  return [{ title: 'codeiq' }, { name: 'description', content: 'Talk with codeiq, an AI assistant from Thomas' }];
};

export const loader = () => json({});

export default function Index() {
  const [searchParams] = useSearchParams();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const error = searchParams.get('error');
    const login = searchParams.get('login');

    if (error === 'github_auth_failed') {
      toast.error('GitHub login failed. Please try again.');
    }

    if (login === 'success') {
      toast.success('Successfully logged in!');
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header setShowLoginPopup={setShowLoginPopup} />
      <ClientOnly fallback={<BaseChat imageDataList={[]} uploadedFiles={[]} />}>
        {() => (
          <>
            {showLoginPopup && (
              <LoginPopup onSuccess={() => setShowLoginPopup(false)} onClose={() => setShowLoginPopup(false)} />
            )}
            <Chat showLoginPopup={showLoginPopup} setShowLoginPopup={setShowLoginPopup} />
          </>
        )}
      </ClientOnly>
    </div>
  );
}
