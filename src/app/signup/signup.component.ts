import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  constructor(private auth: Auth, private validationService: ValidationService, private router: Router) {
    this.form = new FormGroup({
      email: new FormControl(undefined, [Validators.required, Validators.email]),
      password: new FormControl(undefined, [Validators.required, Validators.minLength(6), this.matchValidator('password2', true)]),
      password2: new FormControl(undefined, [Validators.required, Validators.minLength(6), this.matchValidator('password')]),
      firstName: new FormControl(undefined, [Validators.required]),
      lastName: new FormControl(undefined, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  matchValidator: (mt: string,
    r?: boolean) => ValidatorFn = (matchTo, reverse) => {
      return (control: AbstractControl):
        ValidationErrors | null => {
        if (control.parent && reverse) {
          const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
          if (c) {
            c.updateValueAndValidity();
          }
          return null;
        }
        return !!control.parent &&
          !!control.parent.value &&
          control.value ===
          (control.parent?.controls as any)[matchTo].value
          ? null
          : { matching: true };
      };
    };

  signup() {
    from(createUserWithEmailAndPassword(
      this.auth, this.form.value.email, this.form.value.password
    )).subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: {
            message: `ui.login.accountCreatedPleaseLogin`
          }
        });
      },
      error: e => {
        this.validationService.addFirebaseErrorsToForm(e, this.form);
      }
    });
  }

}
