import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  allLanguages = environment.availableLanguages;

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {
  }

  changeLanguage(code: string) {
    this.translateService.use(code);
  }
}
