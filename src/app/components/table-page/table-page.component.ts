import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { tap, switchMap, catchError, takeUntil, Subject } from 'rxjs';
import { GithubIssuesService } from '../../services/github-issues.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  PageEvent,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GithubIssue } from '../../models/github-issue.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomMatPaginatorIntl } from '../../providers/custom-mat-paginator-intl';
import { RowTrackerService } from '../../services/row-tracker.service';
import { PAGE_SIZE } from '../../constants/config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './table-page.component.html',
  styleUrl: './table-page.component.scss',
})
export class TablePageComponent implements OnDestroy {
  private githubIssuesService = inject(GithubIssuesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private rowTrackerService = inject(RowTrackerService);

  private readonly unsubscribe$ = new Subject<void>();

  sort = viewChild<MatSort>(MatSort);
  paginator = viewChild<MatPaginator>(MatPaginator);
  tableContainer = viewChild<ElementRef>('tableContainer');

  pageSize = PAGE_SIZE;
  displayedColumns: string[] = ['created', 'updated', 'title'];
  dataSource = new MatTableDataSource<GithubIssue>([]);

  params$ = this.route.queryParamMap.pipe(
    tap((params: ParamMap) => {
      this.currentSort.set(params.get('sort') || 'created');
      this.currentOrder.set(params.get('order') || 'desc');
      this.currentPage.set(parseInt(params.get('page') || '1', 10));
    })
  );

  currentSort = signal<string>('created');
  currentOrder = signal<string>('desc');
  currentPage = signal<number>(1);
  totalCount = signal<number>(0);
  loading = signal<boolean>(true);

  issues = toSignal(
    this.params$.pipe(
      takeUntil(this.unsubscribe$),
      switchMap(() => {
        this.loading.set(true);

        return this.githubIssuesService
          .getIssues(
            this.currentSort(),
            this.currentOrder(),
            this.currentPage(),
            this.pageSize
          )
          .pipe(
            tap((response) => {
              this.dataSource.data = response.items;

              this.totalCount.set(response.total_count);
              this.loading.set(false);
            }),
            catchError((error) => {
              this.snackBar.open(
                `Error fetching issues: ${error.error.message}`,
                'Close',
                {
                  duration: 3000,
                }
              );

              this.dataSource.data = [];
              this.totalCount.set(0);
              this.loading.set(false);
              return [];
            })
          );
      })
    )
  );

  @HostListener('window:resize')
  onResize() {
    if (this.tableContainer) {
      this.rowTrackerService.viewportHeight.set(
        this.tableContainer()?.nativeElement.clientHeight
      );
    }
  }

  constructor() {
    effect(() => {
      const response = this.issues();
      if (response) {
        this.dataSource.data = response.items;
        this.totalCount.set(response.total_count);
        this.loading.set(false);

        this.rowTrackerService.viewportHeight.set(
          this.tableContainer()?.nativeElement.clientHeight
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSortChange(sort: Sort): void {
    this.currentSort.set(sort.active);
    this.currentOrder.set(sort.direction || 'desc');
    this.currentPage.set(1);
    this.updateUrl();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.updateUrl();
  }

  onTableScroll(event: Event): void {
    const element = event.target as HTMLElement;
    this.rowTrackerService.scrollTop.set(element.scrollTop);
  }

  private updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: this.currentSort(),
        order: this.currentOrder(),
        page: this.currentPage(),
      },
      queryParamsHandling: 'merge',
    });
  }

  onBackClick(): void {
    window.history.back();
  }
}
