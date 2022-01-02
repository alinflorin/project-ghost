import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, collection, deleteDoc, doc } from '@angular/fire/firestore';
import { collection as col, query, where } from 'firebase/firestore';
import { MatSelectionListChange } from '@angular/material/list';
import { user } from 'rxfire/auth';
import { collectionData } from 'rxfire/firestore';
import { from, map, Subscription, switchMap, take } from 'rxjs';
import { Contact } from '../models/contact';
import { Profile } from '../models/profile';
import { ConfirmationService } from '../shared/confirmation/services/confirmation.service';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { AddContactData } from '../add-contact/add-contact-data';

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

  constructor(private auth: Auth, private firestore: Firestore, private confirmationService: ConfirmationService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this._destroy.push(
      user(this.auth).pipe(take(1)).subscribe(u => {
        this.user = u;

        this._destroy.push(
          collectionData(
            col(this.firestore, `contacts/${u!.email}/userContacts`), { idField: 'email' }
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
                return collectionData(
                  query(col(this.firestore, 'profiles'), where('email', 'in', emails)),
                  {
                    idField: 'email'
                  }
                );
              }),
              map(x => {
                return x.map(z => z as Profile);
              })
            )
            .subscribe(x => {
              this.profiles = x;
            })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this._destroy.forEach(x => x.unsubscribe());
  }

  contactsSelectionChanged(event: MatSelectionListChange) {
    this.selectedContacts = event.source.selectedOptions.selected.map(x => x.value.email);
  }

  deleteSelectedContacts() {
    this.confirmationService.confirm().subscribe(x => {
      if (!x) {
        return;
      }
      for (const email of this.selectedContacts) {
        from(deleteDoc(doc(this.firestore, `contacts/${this.user!.email}/userContacts/${email}`))).subscribe();
      }
      this.selectedContacts = [];
    });
  }

  openAddContact() {
    const dialogRef = this.dialog.open(AddContactComponent, {
      data: {
        user: this.user
      } as AddContactData
    });
    dialogRef.afterClosed().subscribe(r => {
      if (!r) {
        return;
      }
      console.log(r);
    });
  }
}
