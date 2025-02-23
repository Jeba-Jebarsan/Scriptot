// Create new file: app/utils/auth.ts
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
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('auth-change'))
    return true
  } catch (error) {
    console.error('Sign out error:', error)
    return false
  }
}