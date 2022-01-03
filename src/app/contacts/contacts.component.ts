import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { Firestore, deleteDoc, doc, collection, where, query, CollectionReference, collectionData } from '@angular/fire/firestore';
import { MatSelectionListChange } from '@angular/material/list';
import { forkJoin, from, map, Observable, Subscription, switchMap, take } from 'rxjs';
import { Contact } from '../models/contact';
import { Profile } from '../models/profile';
import { ConfirmationService } from '../shared/confirmation/services/confirmation.service';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { AddContactData } from '../add-contact/add-contact-data';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  selectedContacts: string[] = [];
  profiles: Profile[] | undefined;

  private _destroy: Subscription[] = [];
  private user: User | null = null;

  constructor(private auth: Auth, private firestore: Firestore,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this._destroy.push(
      user(this.auth).pipe(take(1)).subscribe({
        next: u => {
          this.user = u;

          this._destroy.push(
            collectionData<Contact>(
              query(collection(this.firestore, `contacts/${u!.email}/userContacts`) as CollectionReference<Contact>),
              { idField: 'email' }
            )
              .pipe(
                map(dd => {
                  return dd.map(ddd => (ddd as Contact).email);
                }),
                switchMap(emails => {
                  let em = emails;
                  if (emails.length === 0) {
                    em = ['dummy'];
                  }
                  return collectionData<Profile>(
                    query(collection(this.firestore, 'profiles') as CollectionReference<Profile>,
                      where('email', 'in', em)),
                    {
                      idField: 'email'
                    }
                  );
                }),
                map(x => {
                  return x.map(z => z as Profile);
                })
              )
              .subscribe({
                next: x => {
                  this.profiles = x;
                }, error: e => {
                  this.toastService.fromFirebaseError(e);
                }
              })
          );
        }, error: e => {
          this.toastService.fromFirebaseError(e);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }


  contactsSelectionChanged(event: MatSelectionListChange) {
    this.selectedContacts = event.source.selectedOptions.selected.map(x => x.value);
  }

  deleteSelectedContacts() {
    this.confirmationService.confirm().subscribe(x => {
      if (!x) {
        return;
      }
      const observables: Observable<void>[] = this.selectedContacts.map(email =>
        from(deleteDoc(doc(this.firestore, `contacts/${this.user!.email}/userContacts/${email}`))));

      forkJoin(observables).subscribe({
        next: () => {
        },
        error: e => {
          this.toastService.fromFirebaseError(e);
        }
      });
      this.selectedContacts = [];
    });
  }

  openAddContact() {
    this.dialog.open(AddContactComponent, {
      data: {
        user: this.user
      } as AddContactData
    });
  }
}
