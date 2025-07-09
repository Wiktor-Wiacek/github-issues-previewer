import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { TablePageComponent } from './table-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { of, throwError } from 'rxjs';
import { GithubIssuesService } from '../../services/github-issues.service';

const routes = [
  {
    path: '',
    loadComponent: () =>
      import('../button-page/button-page.component').then(
        (m) => m.ButtonPageComponent
      ),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('../table-page/table-page.component').then(
        (m) => m.TablePageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];

describe('TablePageComponent', () => {
  let component: TablePageComponent;
  let fixture: ComponentFixture<TablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to / url', waitForAsync(
    inject([Location], (location: Location) => {
      fixture.debugElement.query(By.css('button')).nativeElement.click();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('');
      });
    })
  ));

  it('should load issues on component initialization', () => {
    const githubService = TestBed.inject(GithubIssuesService);
    const mockResponse = {
      items: [
        {
          id: 3014600091,
          title: 'ci: update public dir for docs preview deployments',
          created_at: '2025-04-23T16:28:39Z',
          updated_at: '2025-04-23T16:32:26Z',
        },
      ],
      incomplete_results: false,
      total_count: 100,
    };

    spyOn(githubService, 'getIssues').and.returnValue(of(mockResponse));

    fixture = TestBed.createComponent(TablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(githubService.getIssues).toHaveBeenCalledWith(
      'created',
      'desc',
      1,
      component.pageSize
    );
    expect(component.dataSource.data).toEqual(mockResponse.items);
    expect(component.totalCount()).toEqual(100);
    expect(component.loading()).toBeFalse();
  });

  it('should update issues when query parameters change', () => {
    const githubService = TestBed.inject(GithubIssuesService);
    const mockResponse = {
      items: [
        {
          id: 3014600091,
          title: 'ci: update public dir for docs preview deployments',
          created_at: '2025-04-23T16:28:39Z',
          updated_at: '2025-04-23T16:32:26Z',
        },
      ],
      incomplete_results: false,
      total_count: 100,
    };

    spyOn(githubService, 'getIssues').and.returnValue(of(mockResponse));

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();

    fixture = TestBed.createComponent(TablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const sort: Sort = { active: 'updated', direction: 'asc' };
    component.onSortChange(sort);

    expect(router.navigate).toHaveBeenCalled();
    expect(component.currentSort()).toEqual('updated');
    expect(component.currentOrder()).toEqual('asc');
  });

  it('should handle errors when fetching issues fails', () => {
    const githubService = TestBed.inject(GithubIssuesService);
    const error = { error: { message: 'API rate limit exceeded' } };

    spyOn(githubService, 'getIssues').and.returnValue(throwError(() => error));

    const snackBar = TestBed.inject(MatSnackBar);
    spyOn(snackBar, 'open');

    fixture = TestBed.createComponent(TablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error fetching issues: API rate limit exceeded',
      'Close',
      { duration: 3000 }
    );
    expect(component.dataSource.data).toEqual([]);
    expect(component.totalCount()).toEqual(0);
    expect(component.loading()).toBeFalse();
  });
});
