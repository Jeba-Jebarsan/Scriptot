import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabase';
import { toast } from 'react-toastify';
import { useNavigate } from '@remix-run/react';
import { openDatabase, setProfile, getProfile } from '~/lib/persistence/indexedDB';
import { ToastContainer } from 'react-toastify';
import { CheckCircle } from 'lucide-react';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useResponsive } from '~/utils/mobile';

const bannerColors = [
  '#1A1B1E', // Default dark
  '#2563EB', // Blue
  '#059669', // Green
  '#7C3AED', // Purple
  '#DC2626', // Red
  '#D97706'  // Orange
];

const BACKGROUND_IMAGES = [
  'https://images.pexels.com/photos/14553704/pexels-photo-14553704.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  'https://images.pexels.com/photos/19670/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2061168/pexels-photo-2061168.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/8534244/pexels-photo-8534244.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/11167645/pexels-photo-11167645.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/317385/pexels-photo-317385.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/9783346/pexels-photo-9783346.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/249798/pexels-photo-249798.png?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/11438391/pexels-photo-11438391.jpeg?auto=compress&cs=tinysrgb&w=600'
];

export default function ProfileSettingsTab() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showBannerOptions, setShowBannerOptions] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);
  const { isMobile, isTablet } = useResponsive();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    description: '',
    location: '',
    link: '',
    hideProfilePicture: false,
    bannerColor: '#1A1B1E',
    bannerImage: '',
    picture: ''
  });

  useEffect(() => {
    const loadProfileData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const localUser = localStorage.getItem('user');
      if (localUser) {
        const userData = JSON.parse(localUser);
        const db = await openDatabase();
        let profileData = null;
        
        if (db) {
          profileData = await getProfile(db, userData.supabaseId);
        }

        // Set default username as user ID if not set
        const defaultUsername = userData.username || `user_${user.id.slice(0, 8)}`;
        
        const mergedData = {
          ...userData,
          ...profileData,
          username: profileData?.username || defaultUsername,
          name: userData.name || '',
          description: profileData?.description || '',
          location: profileData?.location || '',
          link: profileData?.link || '',
          hide_profile_picture: profileData?.hide_profile_picture || false,
          banner_color: profileData?.banner_color || '#1A1B1E',
          banner_image: profileData?.banner_image || '',
          picture: userData.picture || ''
        };

        setUserInfo(userData);
        setOriginalData(mergedData);
        setFormData(mergedData);
      }
    };

    loadProfileData();

    window.addEventListener('profile-update', loadProfileData);
    window.addEventListener('storage', loadProfileData);

    return () => {
      window.removeEventListener('profile-update', loadProfileData);
      window.removeEventListener('storage', loadProfileData);
    };
  }, []);

  const checkForChanges = (newData: any) => {
    if (!originalData) return false;

    const hasChanged = Object.keys(newData).some(key => {
      const newValue = newData[key];
      // Map form fields to database fields
      const dbKey = key === 'hideProfilePicture' ? 'hide_profile_picture' : 
                    key === 'bannerColor' ? 'banner_color' :
                    key === 'bannerImage' ? 'banner_image' : key;
      
      const originalValue = originalData[dbKey];

      // Special handling for empty strings and boolean values
      if (typeof newValue === 'boolean') {
        return newValue !== originalValue;
      }
      if (typeof newValue === 'string' && newValue.trim() === '') {
        return originalValue !== '';
      }
      return newValue !== originalValue;
    });

    setHasChanges(hasChanged);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    checkForChanges(newFormData);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newFormData = { ...formData, [name]: checked };
    setFormData(newFormData);
    checkForChanges(newFormData);
  };

  const handleBannerColorChange = (color: string) => {
    const newFormData = { ...formData, bannerColor: color, bannerImage: '' };
    setFormData(newFormData);
    checkForChanges(newFormData);
  };

  const handleBannerImageChange = (image: string) => {
    const newFormData = { ...formData, bannerImage: image, bannerColor: '' };
    setFormData(newFormData);
    checkForChanges(newFormData);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info('No changes to save', {
        position: "bottom-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        hideProgressBar: true
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not found');
        return;
      }

      const profileData = {
        id: user.id,
        username: formData.username,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        link: formData.link,
        hide_profile_picture: formData.hideProfilePicture,
        banner_color: formData.bannerColor,
        banner_image: formData.bannerImage,
        picture: userInfo.picture,
        updated_at: new Date().toISOString()
      };

      const db = await openDatabase();
      if (db) {
        await setProfile(db, profileData);
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (error) {
        console.warn('Supabase save failed, but local data was saved:', error);
      }

      const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { 
        ...existingUser,
        ...profileData,
        picture: userInfo.picture,
        supabaseId: user.id,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      window.dispatchEvent(new Event('profile-update'));
      window.dispatchEvent(new Event('storage'));
      
      const toastId = toast.success('User attributes updated successfully', {
        position: "bottom-right",
        autoClose: 500,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        hideProgressBar: true,
        onClose: () => {
          navigate(`/profile/${user.id}`);
        }
      });
      
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 2500);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 rounded-lg hover:bg-blue-500/20"
        >
          <div className="i-ph:arrow-left text-lg" />
          Back
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Profile Settings
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {userInfo?.picture && !formData.hideProfilePicture ? (
          <img src={userInfo.picture} alt="Profile" className="w-24 h-24 rounded-full" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white">
            {formData.name?.charAt(0).toUpperCase() || 'T'}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary"
          />
          <p className="mt-1 text-xs text-bolt-elements-textSecondary">
            This is your public username: <a href={`http://localhost:5173/settings/@${formData.username}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Deepgen/@{formData.username}</a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-1">Link</label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-bolt-elements-background-depth-3 border border-bolt-elements-borderColor rounded-md text-bolt-elements-textPrimary"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hideProfilePicture"
            name="hideProfilePicture"
            checked={formData.hideProfilePicture}
            onChange={handleCheckboxChange}
            className="rounded border-bolt-elements-borderColor"
          />
          <label htmlFor="hideProfilePicture" className="text-sm text-bolt-elements-textPrimary">
            Hide profile picture
          </label>
        </div>

        <button
          onClick={() => setShowBannerOptions(!showBannerOptions)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary rounded-md hover:bg-bolt-elements-background-depth-4 transition-colors"
        >
          <div className={`i-ph:plus ${showBannerOptions ? 'rotate-45' : ''} transition-transform`} />
          Background
        </button>

        {showBannerOptions && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
                Profile Banner Color
              </label>
              <div className="flex gap-2">
                {bannerColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleBannerColorChange(color)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.bannerColor === color && !formData.bannerImage
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' 
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
                Profile Banner Image
              </label>
              <div className={`grid ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
                {BACKGROUND_IMAGES.map((image) => (
                  <button
                    key={image}
                    onClick={() => handleBannerImageChange(image)}
                    className={`w-full aspect-video rounded-lg overflow-hidden transition-all ${
                      formData.bannerImage === image
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' 
                        : 'hover:scale-105'
                    }`}
                  >
                    <img src={image} alt="Banner option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 w-full justify-center
            ${hasChanges 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25' 
              : 'bg-gray-600 cursor-not-allowed text-gray-300'}`}
        >
          <div className="i-ph:floppy-disk text-lg" />
          Save Changes
        </button>
      </div>
    </div>
  );
}