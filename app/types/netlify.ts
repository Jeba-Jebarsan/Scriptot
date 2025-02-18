export interface NetlifyDeploymentStatus {
  id: string;
  url: string;
  state: string;
  created_at: string;
}

export interface NetlifyDeploymentError {
  message: string;
  code: string;
}
