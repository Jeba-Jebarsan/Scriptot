export interface VercelDeploymentStatus {
  id: string;
  url: string;
  state: 'BUILDING' | 'ERROR' | 'READY' | 'CANCELED';
  createdAt: number;
  ready?: boolean;
}

export interface VercelDeploymentError {
  message: string;
  code: string;
}
