import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './toast/toast.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    TranslateModule
  ],
  providers: [
    ToastService
  ]
})
export class ToastModule { }
