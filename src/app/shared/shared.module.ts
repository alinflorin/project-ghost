import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastModule } from './toast/toast.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ToastModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ToastModule,
    TranslateModule
  ]
})
export class SharedModule { }
