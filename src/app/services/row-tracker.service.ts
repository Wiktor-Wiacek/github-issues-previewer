import { computed, Injectable, signal } from '@angular/core';
import { PAGE_SIZE, ROW_HEIGHT } from '../constants/config';

@Injectable({
  providedIn: 'root',
})
export class RowTrackerService {
  totalItems = signal<number>(PAGE_SIZE);
  scrollTop = signal<number>(0);
  rowHeight = signal<number>(ROW_HEIGHT);
  viewportHeight = signal<number>(0);

  startIndex = computed(() => Math.floor(this.scrollTop() / this.rowHeight()));

  visibleRows = computed(() =>
    Math.floor(this.viewportHeight() / this.rowHeight())
  );

  endIndex = computed(() =>
    Math.min(this.startIndex() + this.visibleRows(), this.totalItems())
  );

  visibleRange = computed(
    () =>
      `${this.startIndex() + 1} - ${this.endIndex()} of ${this.totalItems()}`
  );
}
