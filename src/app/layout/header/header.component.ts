import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('isMobile') isMobile = false;
  @Input('drawer') drawer: MatDrawer | undefined;
  allLanguages = environment.availableLanguages;

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {
  }

  changeLanguage(code: string) {
    this.translateService.use(code);
  }

  toggleDrawer() {
    this.drawer?.toggle();
  }
}
