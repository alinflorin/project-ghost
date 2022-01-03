import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  FacebookAuthProvider, OAuthProvider, AuthProvider
} from '@angular/fire/auth';
import { SocialProvider } from '../models/social-provider';
import { from } from 'rxjs';
import { ValidationService } from '../services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    email: new FormControl(undefined, [Validators.required, Validators.email]),
    password: new FormControl(undefined, [Validators.required, Validators.minLength(6)])
  });

  socialProviders = SocialProvider;

  private returnTo = '/dashboard';

  message: string | undefined;

  constructor(private auth: Auth, private validationService: ValidationService, private router: Router,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.actRoute.queryParams.subscribe(qp => {
      if (qp['returnTo'] != null) {
        this.returnTo = qp['returnTo'];
      }
      if (qp['message'] != null) {
        this.message = qp['message'];
      }
    });
  }

  ngOnDestroy(): void {

  }

  loginWithEmailAndPassword() {
    from(signInWithEmailAndPassword(this.auth, this.form.value.email, this.form.value.password)).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnTo);
      },
      error: e => {
        this.validationService.addFirebaseErrorsToForm(e, this.form);
      }
    });
  }

  loginWithSocial(provider: SocialProvider) {
    let authProvider: AuthProvider | undefined;
    switch (provider) {
      case SocialProvider.Facebook:
        authProvider = new FacebookAuthProvider();
        break;
      case SocialProvider.Microsoft:
        authProvider = new OAuthProvider('microsoft.com');
        break;
      case SocialProvider.Google:
      default:
        authProvider = new GoogleAuthProvider();
        break;
    }
    from(signInWithPopup(this.auth, authProvider)).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnTo);
      },
      error: e => {
        this.validationService.addFirebaseErrorsToForm(e, this.form);
      }
    });
  }
}
