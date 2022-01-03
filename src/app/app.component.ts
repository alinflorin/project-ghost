import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Firestore, docData, setDoc, docSnapshots, serverTimestamp, doc } from '@angular/fire/firestore';
import { MediaObserver } from '@angular/flex-layout';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profile } from './models/profile';
import { UserPreferences } from './models/user-preferences';
import { LocaleService } from './services/locale.service';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isMobile = false;
  private _destroy: Subscription[] = [];
  private upSub: Subscription | undefined;
  private profileSub: Subscription | undefined;
  private preferencesReadFirstTime = false;
  private disableLastSeen = false;
  private hbInterval: any | undefined;
  user: User | null = null;
  profile: Profile | undefined;

  constructor(private localeService: LocaleService, private translateService: TranslateService,
    private mediaObserver: MediaObserver, private firestore: Firestore,
    private auth: Auth,
    private updateService: UpdateService) {
    let lang = environment.defaultLanguage;
    const lsLang = localStorage.getItem('lang');
    if (lsLang) {
      lang = lsLang;
    }
    this.translateService.use(lang);
  }

  ngOnInit(): void {
    this._destroy.push(
      this.mediaObserver.asObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isActive('xs');
      })
    );

    this._destroy.push(
      user(this.auth).subscribe(user => {
        this.user = user;
        if (user) {
          this.profileSub = docSnapshots<Profile>(doc(this.firestore, `profiles/${user!.email}`)).subscribe(ds => {
            if (ds.metadata.hasPendingWrites) {
              return;
            }
            this.profile = ds.data();
            this.profile!.email = ds.id;
          });

          this.upSub = docData<UserPreferences>(doc(this.firestore, `userPreferences/${user.email}`), {
            idField: 'email'
          }).subscribe(up => {
            if (up?.disableLastSeen) {
              this.disableLastSeen = true;
            } else {
              this.disableLastSeen = false;
            }

            if (!this.preferencesReadFirstTime) {
              this.preferencesReadFirstTime = true;
              if (up?.lang) {
                this.translateService.use(up.lang).subscribe();
              }

              this.hb();
              this.hbInterval = setInterval(() => {
                this.hb();
              }, environment.hb);

            }
          });
          this._destroy.push(
            this.upSub
          );
          this._destroy.push(
            this.profileSub
          );
        } else {
          if (this.upSub) {
            this.upSub.unsubscribe();
          }
          if (this.profileSub) {
            this.profileSub.unsubscribe();
          }
          if (this.hbInterval) {
            clearInterval(this.hbInterval);
            this.hbInterval = undefined;
          }
        }
      })
    );


  }

  ngOnDestroy(): void {
    this.preferencesReadFirstTime = false;
    if (this.hbInterval) {
      clearInterval(this.hbInterval);
      this.hbInterval = undefined;
    }
    this._destroy.forEach(x => x.unsubscribe());
  }

  private hb() {
    setDoc<Profile>(doc(this.firestore, `profiles/${this.user!.email}`), {
      displayName: this.user!.displayName,
      email: this.user!.email,
      lastSeen: this.disableLastSeen ? null : (serverTimestamp() as any),
      photo: this.user!.photoURL
    } as Partial<Profile>, {
      merge: true
    }).then();
  }
}
