import { NgModule } from '@angular/core';
import { AuthGuard, AuthPipeGenerator, canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { ConversationComponent } from './conversation/conversation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';

const apg: AuthPipeGenerator = (next, _) => redirectUnauthorizedTo(`login?returnTo=${encodeURIComponent(next.url.toString())}`);

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    ...canActivate(apg)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'contacts',
    component: ContactsComponent,
    ...canActivate(apg)
  },
  {
    path: 'settings',
    component: SettingsComponent,
    ...canActivate(apg)
  },
  {
    path: 'conversation/:friendEmail',
    component: ConversationComponent,
    ...canActivate(apg)
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
