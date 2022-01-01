import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { noop } from 'rxjs';

type ShouldReuseRoute = (future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) => boolean;

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private initialized = false;
  private initialDone = false;

  get currentLocale(): string {
    return this.translate.currentLang;
  }

  constructor(
    private router: Router,
    private translate: TranslateService,
    @Optional()
    @SkipSelf()
    otherInstance: LocaleService,
  ) {
    if (otherInstance) throw 'LocaleService should have only one instance.';
  }

  private setRouteReuse(reuse: ShouldReuseRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = reuse;
  }

  private subscribeToLangChange() {
    this.translate.onLangChange.subscribe(async () => {
      if (!this.initialDone) {
        this.initialDone = true;
        return;
      }
      const { shouldReuseRoute } = this.router.routeReuseStrategy;

      this.setRouteReuse(() => false);
      this.router.navigated = false;

      await this.router.navigateByUrl(this.router.url).catch(noop);
      this.setRouteReuse(shouldReuseRoute);
    });
  }

  initLocale(localeId: string, defaultLocaleId = localeId) {
    if (this.initialized) return;
    this.subscribeToLangChange();
    this.initialized = true;
  }

}
