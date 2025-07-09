export interface GithubIssue {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  html_url?: string;
  number?: number;
}
