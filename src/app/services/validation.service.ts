import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  addFirebaseErrorsToForm(err: any, form: AbstractControl) {
    if (err == null) {
      return;
    }
    const fe = err as FirebaseError;
    if (fe == null) {
      return;
    }
    if (fe.code != null) {
      form.setErrors({
        backend: ['ui.errors.firebase.' + fe.code]
      });
      return;
    }
    if (fe.message != null) {
      form.setErrors({
        backend: [fe.message]
      });
      return;
    }
  }
}
