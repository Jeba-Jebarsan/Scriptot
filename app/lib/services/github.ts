import { atom } from 'nanostores';

interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubConnection {
  isConnected: boolean;
  user: GitHubUser | null;
  token: string | null;
}

// Initialize GitHub connection store
export const githubConnection = atom<GitHubConnection>({
  isConnected: false,
  user: null,
  token: null,
}); 