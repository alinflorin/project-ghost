import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ToastData } from '../models/toast-data';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ToastData, private snackBarRef: MatSnackBarRef<ToastComponent>) { }

  ngOnInit(): void {
  }

  onToastClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.data?.onClick) {
      this.data.onClick();
    }
    this.snackBarRef.dismiss();
  }
}
