import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RowTrackerService } from '../services/row-tracker.service';

@Injectable({
  providedIn: 'root',
})
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  private rowTrackerService = inject(RowTrackerService);

  override itemsPerPageLabel = '';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return 'No records found';
    }
    const startIndex = page * pageSize + 1;
    const endIndex = Math.min((page + 1) * pageSize, length);
    return `${startIndex + this.rowTrackerService.startIndex()} - ${
      startIndex + this.rowTrackerService.endIndex() - 1
    } of ${endIndex}(${length})`;
  };
}
