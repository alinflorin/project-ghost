import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    email: new FormControl(undefined, [Validators.required, Validators.email])
  });
  constructor(private auth: Auth, private validationService: ValidationService, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  forgotPassword() {
    from(sendPasswordResetEmail(this.auth, this.form.value.email)).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: {
            message: `ui.login.passwordRecoveryEmailSent`
          }
        });
      },
      error: e => {
        this.validationService.addFirebaseErrorsToForm(e, this.form);
      }
    });
  }

}
