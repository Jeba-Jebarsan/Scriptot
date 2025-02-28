// Create new file: app/utils/auth.ts
import { chatStore } from '~/lib/stores/chat'
import { supabase } from '~/lib/supabase'

export const checkAuthStatus = async () => {
  if (typeof window === 'undefined') return false
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

export const signOut = async () => {
  try {
    // Clear storage first
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Reset any app state
    chatStore.set({ started: false, aborted: false, showChat: false });
    
    // Perform Supabase signout
    await supabase.auth.signOut();
    
    // Dispatch events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('auth-change'));
    
    // Force navigation to home page
    window.location.href = '/';
    
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};