import type { VercelDeploymentStatus } from '~/types/vercel';

const VERCEL_API_BASE = 'https://api.vercel.com/v13';

export class VercelService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${VERCEL_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as { message?: string };
      throw new Error(error.message || 'Failed to communicate with Vercel API');
    }

    return response.json();
  }

  async createDeployment(
    projectName: string,
    files: Record<string, { data: string }>
  ): Promise<VercelDeploymentStatus> {
    const deployment = await this.fetchWithAuth('/deployments', {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
        target: 'production',
        files: Object.entries(files).map(([path, { data }]) => ({
          file: path,
          data: Buffer.from(data).toString('base64'),
        })),
      }),
    });

    return deployment as VercelDeploymentStatus;
  }

  async getDeploymentStatus(deploymentId: string): Promise<VercelDeploymentStatus> {
    const deployment = await this.fetchWithAuth(`/deployments/${deploymentId}`);
    return deployment as VercelDeploymentStatus;
  }
}
