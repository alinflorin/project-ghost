import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { LocaleService } from './services/locale.service';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private localeService: LocaleService, private translateService: TranslateService,
    private updateService: UpdateService) {
    this.translateService.use(environment.defaultLanguage);
  }
}
