import { TestBed } from '@angular/core/testing';

import { GithubIssuesService } from './github-issues.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { GithubIssuesResponse } from '../models/github-issues-response';

describe('GithubIssuesService', () => {
  let service: GithubIssuesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GithubIssuesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get issues with default parameters', () => {
    const mockResponse: GithubIssuesResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [{ id: 1 }],
    } as GithubIssuesResponse;

    service.getIssues().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.github.com/search/issues' &&
        req.params.get('q') === 'repo:angular/components' &&
        req.params.get('sort') === 'created' &&
        req.params.get('order') === 'desc' &&
        req.params.get('page') === '1' &&
        req.params.get('per_page') === '100'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get issues with custom parameters', () => {
    const mockResponse: GithubIssuesResponse = {
      total_count: 1,
      incomplete_results: false,
      items: [{ id: 1 }],
    } as GithubIssuesResponse;

    service.getIssues('updated', 'asc', 2, 50).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.github.com/search/issues' &&
        req.params.get('q') === 'repo:angular/components' &&
        req.params.get('sort') === 'updated' &&
        req.params.get('order') === 'asc' &&
        req.params.get('page') === '2' &&
        req.params.get('per_page') === '50'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle http error', () => {
    service.getIssues().subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(
      (req) => req.url === 'https://api.github.com/search/issues'
    );
    req.flush('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
});
