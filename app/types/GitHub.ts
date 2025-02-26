export interface GitHubRepoInfo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
}

export interface GitHubContent {
  content: string;
  encoding: string;
}

export interface RepositoryStats {
  totalFiles: number;
  totalSize: number;
  languages: { [key: string]: number };
  hasPackageJson: boolean;
  hasDependencies: boolean;
} 