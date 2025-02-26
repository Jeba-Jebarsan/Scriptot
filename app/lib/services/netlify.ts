import { atom } from 'nanostores';
import type { NetlifyConnection, NetlifyUser, NetlifyDeploymentStatus, NetlifySite, NetlifyDeployment, NetlifyDeploymentError } from '~/types/netlify';
import { toast } from 'react-toastify';
import { logStore } from '../stores/logs';

// Add missing atom
export const isFetchingStats = atom<boolean>(false);

// Initialize with stored connection or defaults
const storedConnection = typeof window !== 'undefined' ? localStorage.getItem('netlify_connection') : null;
const initialConnection: NetlifyConnection = storedConnection
  ? JSON.parse(storedConnection)
  : {
      user: null,
      token: '',
      stats: undefined,
    };

export const netlifyConnection = atom<NetlifyConnection>(initialConnection);
export const isConnecting = atom<boolean>(false);

export const updateNetlifyConnection = (updates: Partial<NetlifyConnection>) => {
  const currentState = netlifyConnection.get();
  const newState = { ...currentState, ...updates };
  netlifyConnection.set(newState);

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('netlify_connection', JSON.stringify(newState));
  }
};

export async function fetchNetlifyStats(token: string) {
  try {
    isFetchingStats.set(true);
    const cleanToken = token.replace('Bearer ', '');

    const response = await fetch('https://api.netlify.com/api/v1/user', {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      const errorData = data as { message?: string };
      throw new Error(errorData.message || `Failed to fetch user: ${response.status}`);
    }

    // Only update connection if verification is successful
    updateNetlifyConnection({
      user: data as NetlifyUser,
      token: cleanToken,
    });
    return true;
  } catch (error) {
    console.error('Netlify API Error:', error);
    netlifyConnection.set({ user: null, token: '', stats: undefined });
    throw error;
  } finally {
    isFetchingStats.set(false);
  }
}

export class NetlifyService {
  private token: string;
  private readonly NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

  constructor(token: string) {
    this.token = token.replace('Bearer ', '');
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.NETLIFY_API_BASE}/user`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async createDeployment(projectName: string, files: Record<string, { data: string }>) {
    try {
      // First, create or get the site
      const site = await this.createOrGetSite(projectName) as NetlifySite;

      // Format files for deployment
      const formattedFiles = Object.entries(files).map(([path, { data }]) => ({
        path,
        content: data,
      }));

      // Create deployment
      const deployment = await this.fetchWithAuth(`/sites/${site.id}/deploys`, {
        method: 'POST',
        body: JSON.stringify({
          files: formattedFiles,
          branch: 'main',
          draft: false
        }),
      });

      return {
        id: (deployment as NetlifyDeployment).id,
        url: (deployment as NetlifyDeployment).url || `https://${projectName}.netlify.app`,
        state: (deployment as NetlifyDeployment).state,
        created_at: (deployment as NetlifyDeployment).created_at,
      };
    } catch (error) {
      console.error('Deployment error:', error);
      if (error instanceof Error) {
        throw new Error(`Deployment failed: ${error.message}`);
      }
      throw new Error('Deployment failed: Unknown error');
    }
  }

  private async createOrGetSite(name: string) {
    try {
      // Try to get existing site first
      const sites = await this.fetchWithAuth('/sites') as NetlifySite[];
      const existingSite = sites.find((site) => site.name === name);
      
      if (existingSite) {
        return existingSite;
      }

      // Create new site if doesn't exist
      return await this.fetchWithAuth('/sites', {
        method: 'POST',
        body: JSON.stringify({
          name,
          custom_domain: null,
          force_ssl: true,
        }),
      });
    } catch (error) {
      console.error('Site creation error:', error);
      throw new Error('Failed to create or get site');
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.NETLIFY_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json() as { message?: string };
        throw new Error(error.message || `API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Netlify API error:', error);
      throw error;
    }
  }

  // ... rest of the service implementation
}