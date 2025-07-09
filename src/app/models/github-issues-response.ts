import { GithubIssue } from './github-issue.model';

export interface GithubIssuesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubIssue[];
}
