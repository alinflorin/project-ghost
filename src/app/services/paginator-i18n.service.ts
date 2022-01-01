import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PaginatorI18nService {

  constructor(private translateService: TranslateService) { }

  public getPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    this.translateService.stream('ui.paginator').subscribe(dict => {
      Object.assign(paginatorIntl, dict);
      paginatorIntl.changes.next();
    });
    const originalGetRangeLabel = paginatorIntl.getRangeLabel;
    paginatorIntl.getRangeLabel = (page: number, size: number, len: number) => {
      return originalGetRangeLabel(page, size, len)
        .replace('of', this.translateService.instant('ui.paginator.of'));
    };
    return paginatorIntl;
  }
}
