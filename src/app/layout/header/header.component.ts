import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Auth, User, user, signOut } from '@angular/fire/auth';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input('isMobile') isMobile = false;
  @Input('drawer') drawer: MatDrawer | undefined;
  allLanguages = environment.availableLanguages;
  private _destroy: Subscription[] = [];
  user: User | null = null;

  constructor(public translateService: TranslateService, private auth: Auth, private router: Router) { }

  ngOnInit(): void {
    this._destroy.push(
      user(this.auth).subscribe(u => {
        this.user = u;
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }

  changeLanguage(code: string) {
    this.translateService.use(code);
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
