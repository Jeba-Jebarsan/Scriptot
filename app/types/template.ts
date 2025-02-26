export interface NetlifyUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface NetlifySite {
  id: string;
  name: string;
  url: string;
  admin_url: string;
  build_settings?: {
    provider: string;
  };
  published_deploy?: {
    published_at: string;
  };
}

export interface NetlifyStats {
  sites: NetlifySite[];
  totalSites: number;
}

export interface NetlifyConnection {
  user: NetlifyUser | null;
  token: string;
  stats?: NetlifyStats;
}