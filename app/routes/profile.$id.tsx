import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { openDatabase, getProfile } from '~/lib/persistence/indexedDB';
import { supabase } from '~/lib/supabase';
import { toast } from 'react-hot-toast';
import { Header } from '~/components/header/Header';

export default function ProfilePage() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
      const loadProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        const db = await openDatabase();
        let userData = null;
        
        if (db) {
          const user = localStorage.getItem('user');
          if (user) {
            const parsedUser = JSON.parse(user);
            userData = await getProfile(db, parsedUser.supabaseId);
          }
        }

        if (!userData) {
          const user = localStorage.getItem('user');
          if (user) {
            userData = JSON.parse(user);
          }
        }

        setUserInfo(userData);
      };

      loadProfile();

      // Listen for profile updates
      window.addEventListener('profile-update', loadProfile);
      window.addEventListener('storage', loadProfile);
      
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/');
        }
      });
      
      return () => {
        window.removeEventListener('profile-update', loadProfile);
        window.removeEventListener('storage', loadProfile);
        subscription.unsubscribe();
      };
    }, [navigate]);
  
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'profile') => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not found');

        const fileExt = file.name.split('.').pop();
        const fileName = `${type}-${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${type}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('user-content')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('user-content')
          .getPublicUrl(filePath);

        // Update profile with new image
        const updates = type === 'cover' 
          ? { banner_image: publicUrl }
          : { picture: publicUrl };

        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, ...updates });

        if (error) throw error;

        // Update local storage
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...existingUser, ...updates }));

        // Refresh UI
        window.dispatchEvent(new Event('profile-update'));
        window.dispatchEvent(new Event('storage'));

        toast.success(`${type === 'cover' ? 'Cover' : 'Profile'} photo updated`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="min-h-screen bg-bolt-elements-background-depth-1">
        <Header setShowLoginPopup={setShowLoginPopup} />
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 rounded-lg hover:bg-blue-500/20"
              >
                <div className="i-ph:arrow-left text-lg" />
                Back
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Profile
              </h1>
            </div>
            <div className="relative">
              <div 
                className="h-48 w-full rounded-t-xl bg-cover bg-center"
                style={{ 
                  backgroundColor: userInfo?.banner_color || '#1A1B1E',
                  backgroundImage: userInfo?.banner_image ? `url(${userInfo.banner_image})` : 'none',
                  transition: 'all 0.3s ease'
                }} 
              />
             
              
              <div className="absolute -bottom-16 left-6">
                <div className="relative group">
                  {userInfo?.picture && !userInfo?.hide_profile_picture ? (
                    <img 
                      src={userInfo.picture} 
                      alt={userInfo.name || 'Profile'} 
                      className="w-32 h-32 rounded-full border-4 border-bolt-elements-background-depth-2 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-bolt-elements-background-depth-2 
                                flex items-center justify-center text-4xl text-white">
                      {userInfo?.name?.charAt(0).toUpperCase() || 'T'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-bolt-elements-background-depth-2 rounded-b-xl shadow-lg pt-20 pb-6 px-6 
                          border border-bolt-elements-borderColor">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-bolt-elements-textPrimary">
                    {userInfo?.name}
                  </h1>
                  <p className="text-bolt-elements-textSecondary">
                    Deepgen/@{userInfo?.username || userInfo?.supabaseId}
                  </p>
                  <p className="text-sm text-bolt-elements-textSecondary mt-1">
                    {userInfo?.email}
                  </p>
                </div>
                <Link
                  to="/settings"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                            transition-colors flex items-center gap-2"
                >
                  <div className="i-ph:pencil text-lg" />
                  Edit Profile
                </Link>
              </div>
              
              <div className="space-y-4">
                {userInfo?.description && (
                  <p className="text-sm text-bolt-elements-textSecondary">
                    <span className="font-medium">Description:</span> {userInfo.description}
                  </p>
                )}
                {userInfo?.location && (
                  <p className="text-sm text-bolt-elements-textSecondary flex items-center gap-2">
                    <div className="i-ph:map-pin text-lg" />
                    <span>{userInfo.location}</span>
                  </p>
                )}
                {userInfo?.link && (
                  <p className="text-sm text-bolt-elements-textSecondary flex items-center gap-2">
                    <div className="i-ph:link text-lg" />
                    <a href={userInfo.link} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-500 hover:text-blue-600">
                      {userInfo.link}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }