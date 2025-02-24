// Create new file: app/utils/auth.ts
import { supabase } from '~/lib/supabase'

export const checkAuthStatus = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const user = localStorage.getItem('user');
      console.log('Checking auth status, user:', user); // Debug log
      if (!user) return false;
      
      const parsedUser = JSON.parse(user);
      return !!parsedUser?.email && !!parsedUser?._id && (!!parsedUser?.googleToken || !!parsedUser?.githubToken);
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

export const useAuthUser = () => {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const convexUser = useQuery(api.users.getUser, { email: user?.email });
  
  return convexUser;
};