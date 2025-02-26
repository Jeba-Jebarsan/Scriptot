export interface NetlifyConnection {
  user: NetlifyUser | null;
  token: string;
  stats?: NetlifyStats;
  site?: { id: string };
  deploy?: { id: string };
}

export interface NetlifyUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface NetlifyStats {
  sites: any[];
  totalSites: number;
}

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

export interface NetlifySite {
  id: string;
  name: string;
  url: string;
}

export interface NetlifyDeployment {
  id: string;
  url: string;
  state: string;
  created_at: string;
}

export interface NetlifySiteInfo {
  id: string;
  name: string;
  url: string;
  chatId: string;
}