import type { NetlifyDeploymentStatus } from "../../types/netlify";

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

interface NetlifySite {
  id: string;
  name: string;
}

interface NetlifyDeployment {
  id: string;
  url: string;
  state: string;
  created_at: string;
}

export class NetlifyService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${NETLIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json() as { message?: string };
      throw new Error(error.message || 'Failed to communicate with Netlify API');
    }

    return response.json();
  }

  async createDeployment(projectName: string, files: Record<string, { data: string }>): Promise<NetlifyDeploymentStatus> {
    const site = await this.fetchWithAuth('/sites', {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
      }),
    }) as NetlifySite;

    const deployment = await this.fetchWithAuth(`/sites/${site.id}/deploys`, {
      method: 'POST',
      body: JSON.stringify({
        files: Object.entries(files).map(([path, { data }]) => ({
          path,
          content: data,
        })),
      }),
    }) as NetlifyDeployment;

    return {
      id: deployment.id,
      url: deployment.url || `${projectName}.netlify.app`,
      state: deployment.state,
      created_at: deployment.created_at,
    };
  }

  async getDeploymentStatus(deploymentId: string): Promise<NetlifyDeploymentStatus> {
    const status = await this.fetchWithAuth(`/deploys/${deploymentId}`);
    return status as NetlifyDeploymentStatus;
  }
}