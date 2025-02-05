import type { NetlifyDeploymentStatus } from "../../types/netlify";

const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

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
    const deployment = await this.fetchWithAuth('/sites', {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
        files: Object.entries(files).map(([path, { data }]) => ({
          path,
          content: data,
        })),
      }),
    });

    return deployment as NetlifyDeploymentStatus;
  }
}