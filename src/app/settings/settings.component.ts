import { Component, OnInit } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { doc, docData, Firestore, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { from, switchMap, take } from 'rxjs';
import { UserPreferences } from '../models/user-preferences';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  disableLastSeen: boolean | undefined;
  private user: User | null = null;

  constructor(private fireStore: Firestore, private auth: Auth, private toastService: ToastService) { }

  ngOnInit(): void {
    user(this.auth).pipe(take(1)).subscribe(u => {
      this.user = u;
      docData<UserPreferences>(doc(this.fireStore, `userPreferences/${u!.email}`), { idField: 'email' })
        .pipe(take(1)).subscribe({
          next: up => {
            this.disableLastSeen = up?.disableLastSeen;
          }, error: e => {
            this.toastService.fromFirebaseError(e);
          }
        });
    });
  }

  disableLastSeenChanged(event: MatSlideToggleChange) {

    from(setDoc(doc(this.fireStore, `userPreferences/${this.user!.email}`), {
      disableLastSeen: event.checked
    }, {
      merge: true
    }))
      .pipe(
        switchMap(() => from(setDoc(doc(this.fireStore, `profiles/${this.user!.email}`), {
          lastSeen: !event.checked ? (serverTimestamp() as any) : null
        }, {
          merge: true
        })))
      )
      .subscribe({
        next: () => {
          this.disableLastSeen = event.checked;
        },
        error: e => {
          this.toastService.fromFirebaseError(e);
        }
      });
  }

}
