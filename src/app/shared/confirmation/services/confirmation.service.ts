import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ConfirmationData } from '../models/confirmation-data';
@Injectable()
export class ConfirmationService {

  constructor(private matDialog: MatDialog, private translateService: TranslateService) { }

  confirm(message?: string) {
    if (!message) {
      message = this.translateService.instant('ui.confirmation.areYouSure');
    }
    const dialogRef = this.matDialog.open(ConfirmationComponent, {
      data: {
        message
      } as ConfirmationData
    });
    return dialogRef.afterClosed().pipe(
      map(x => {
        if (x == null || x === false) {
          return false;
        }
        return true;
      })
    );
  }
}
