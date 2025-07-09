import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubIssuesResponse } from '../models/github-issues-response';

@Injectable({
  providedIn: 'root',
})
export class GithubIssuesService {
  private baseUrl = 'https://api.github.com/search/issues';
  private http = inject(HttpClient);

  getIssues(
    sort = 'created',
    order = 'desc',
    page = 1,
    perPage = 100
  ): Observable<GithubIssuesResponse> {
    const params = {
      q: 'repo:angular/components',
      sort,
      order,
      page: page.toString(),
      per_page: perPage.toString(),
    };

    return this.http.get<GithubIssuesResponse>(this.baseUrl, { params });
  }
}
