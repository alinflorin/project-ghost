import { Component, Inject, OnInit } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { AddContactData } from './add-contact-data';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(undefined, [Validators.required, Validators.email])
  });
  constructor(private firestore: Firestore, @Inject(MAT_DIALOG_DATA) private data: AddContactData, private dialogRef: MatDialogRef<AddContactComponent>) { }

  ngOnInit(): void {
  }

  addContact() {
    from(getDoc(doc(this.firestore, `profiles/${this.form.value.email}`))).subscribe(x => {
      if (!x.exists()) {
        this.form.get('email')!.setErrors({
          inexistent: true
        });
        return;
      }
      from(
        setDoc(doc(this.firestore, `contacts/${this.data!.user!.email}/userContacts/${this.form.value.email}`), {
          email: this.form.value.email
        })
      ).subscribe(() => {
        this.dialogRef.close();
      });
    });


  }
}
