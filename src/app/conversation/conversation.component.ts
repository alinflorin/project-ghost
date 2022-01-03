import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, doc, docData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { Profile } from '../models/profile';
import { RsaMessageType } from '../models/rsa-worker-message';
import { RsaService } from '../services/rsa.service';
import { ToastService } from '../shared/toast/services/toast.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  friendEmail: string | undefined;
  private _destroy: Subscription[] = [];
  friendProfile: Profile | undefined;
  private refreshInterval: any | undefined;
  user: User | null = null;
  messages: Message[] | undefined;
  key: string | null = null;
  isLoading = false;

  sendForm = new FormGroup({
    text: new FormControl()
  });

  keyForm = new FormGroup({
    key: new FormControl(undefined, [Validators.required]),
    persist: new FormControl(false)
  });

  constructor(private actRoute: ActivatedRoute, private toastService: ToastService,
    private auth: Auth, private firestore: Firestore, private translateService: TranslateService,
    private rsaService: RsaService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.rsaService.asObservable().subscribe({
        next: rsaMessage => {

          this.isLoading = false;

          console.log(rsaMessage);
        },
        error: e => {

        }
      })
    );

    this._destroy.push(
      this.actRoute.params.subscribe(p => {
        this.friendEmail = p['friendEmail'];
        this.key = localStorage.getItem('key_' + this.friendEmail);

        this._destroy.push(
          user(this.auth).subscribe(u => {
            this.user = u;

          })
        );

        this._destroy.push(
          docData(doc(this.firestore, `profiles/${this.friendEmail}`), { idField: 'email' }).subscribe(fp => {
            this.friendProfile = fp;
          })
        );
        this.refreshInterval = setInterval(() => {
          if (this.friendProfile == null) {
            return;
          }
          this.friendProfile = { ...this.friendProfile };
        }, environment.hb);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.refreshInterval != null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
    this._destroy.forEach(x => x.unsubscribe());
  }

  saveKey() {
    this.isLoading = true;
    this.rsaService.send({
      type: RsaMessageType.GenerateKeyRequest,
      data: {
        passphrase: this.keyForm.value.key
      }
    });
  }

  isFriendOnline() {
    if (this.friendProfile == null) {
      return false;
    }
    if (this.friendProfile.lastSeen == null) {
      return false;
    }
    const now = new Date().getTime();
    return (now - this.friendProfile.lastSeen!.toDate().getTime()) < environment.hb;
  }

  private getConvId() {
    return [this.user?.email || 'unknown', this.friendEmail || 'unknown'].sort().join('_');
  }

  private subscribeToMessages() {
    this._destroy.push(
      collectionData(
        query(collection(this.firestore, `conversations/${this.getConvId()}/messages`) as CollectionReference<Message>,
          orderBy(`sentDate`, `asc`)
        ), { idField: 'id' }
      ).subscribe(msg => {
        this.messages = msg;
      })
    );
  }
}
