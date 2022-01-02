import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Auth, User, user, signOut } from '@angular/fire/auth';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from, Subscription } from 'rxjs';
import { Profile } from 'src/app/models/profile';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input('isMobile') isMobile = false;
  @Input('profile') profile: Profile | undefined;
  @Input('drawer') drawer: MatDrawer | undefined;
  @Input('user') user: User | null = null;

  allLanguages = environment.availableLanguages;
  constructor(public translateService: TranslateService, private router: Router, private auth: Auth) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  changeLanguage(code: string) {
    localStorage.setItem('lang', code);
    this.translateService.use(code).subscribe();
  }

  toggleDrawer() {
    this.drawer?.toggle();
  }

  logout() {
    from(signOut(this.auth)).subscribe({
      next: () => {
        this.router.navigate(['login']);
      }
    });
  }
}
