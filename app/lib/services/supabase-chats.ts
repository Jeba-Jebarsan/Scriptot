import type { Message } from 'ai';
import { supabase } from '../supabase';

export interface SupabaseChat {
  id: string;
  user_id: string;
  email: string;
  name: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export const supabaseChatsService = {
  async getAllChats(): Promise<SupabaseChat[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chats:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllChats:', error);
      throw error;
    }
  },

  async createChat(title: string, messages: Message[]): Promise<SupabaseChat> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            title,
            messages,
            user_id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating chat:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createChat:', error);
      throw error;
    }
  },

  async updateChat(id: string, title: string, messages: Message[]): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .update({ 
        title, 
        messages, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  },

  async deleteChat(id: string): Promise<void> {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
};