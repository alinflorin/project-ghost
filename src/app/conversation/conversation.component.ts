import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import {
  addDoc, collection, collectionData, CollectionReference, doc, docData,
  Firestore, orderBy, query, serverTimestamp
} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, from, map, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { Profile } from '../models/profile';
import { RsaBundle } from '../models/rsa-bundle';
import { RsaMessageType, RsaWorkerMessage } from '../models/rsa-worker-message';
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
  messages: Message[] = [];
  key: RsaBundle | undefined;

  sendForm = new FormGroup({
    text: new FormControl()
  });

  keyForm = new FormGroup({
    key: new FormControl(undefined, [Validators.required]),
    persist: new FormControl(false)
  });

  @ViewChild('textArea') textArea: ElementRef<HTMLTextAreaElement> | undefined;
  @ViewChild('messagesWrapper') messagesWrapper: ElementRef<HTMLDivElement> | undefined;

  constructor(private actRoute: ActivatedRoute, private toastService: ToastService,
    private auth: Auth, private firestore: Firestore,
    private rsaService: RsaService) { }

  ngOnInit(): void {
    this._destroy.push(
      this.actRoute.params.subscribe(p => {
        this.friendEmail = p['friendEmail'];
        this._destroy.push(
          user(this.auth).subscribe(u => {
            this.user = u;

            const lsKey = localStorage.getItem('key_' + this.friendEmail);
            if (lsKey != null) {
              this.key = JSON.parse(lsKey) as RsaBundle;
              this.subscribeToMessages();
            }
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
    this.rsaService.sendAndGetResponse({
      type: RsaMessageType.GenerateKey,
      data: {
        passphrase: this.keyForm.value.key
      }
    }).subscribe(rsaMessage => {
      const bundle = rsaMessage.data as RsaBundle;
      if (this.keyForm.value.persist) {
        localStorage.setItem('key_' + this.friendEmail, JSON.stringify(bundle));
      }
      this.key = bundle;
      this.subscribeToMessages();
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

  sendMessage() {
    const plainText = this.sendForm.value.text;
    if (plainText == null || plainText.length === 0) {
      return;
    }

    this.rsaService.sendAndGetResponse({
      type: RsaMessageType.Encrypt,
      data: {
        text: plainText,
        bundle: this.key
      }
    }).subscribe(rsaMessage => {
      this.sendForm.reset();
      this.textArea!.nativeElement.focus();

      const message = {
        content: rsaMessage.data,
        from: this.user!.email,
        sentDate: (serverTimestamp() as any),
        seenDate: null,
        to: this.friendEmail!
      } as Message;
      from(
        addDoc(collection(this.firestore, `conversations/${this.getConvId()}/messages`), message)
      ).subscribe({
        next: () => {
          // ignored
        },
        error: e => {
          this.toastService.fromFirebaseError(e);
        }
      });
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      const val = this.sendForm.get('text')!.value as string;
      if (event.ctrlKey) {
        this.sendForm.get('text')!.setValue(val + '\n');
      } else {
        if (val && val.length > 0) {
          this.sendMessage();
        }
      }
    }
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
        const observables = msg.filter(x => this.messages.findIndex(z => z.id === x.id) === -1)
          .map(m => this.rsaService.sendAndGetResponse({
            data: {
              encrypted: m.content,
              bundle: this.key
            },
            type: RsaMessageType.Decrypt
          }).pipe(
            map(x => {
              (x as any).m = m;
              return x;
            })
          ));
        forkJoin(observables).subscribe(rsaMessages => {
          const list: Message[] = [...this.messages];
          rsaMessages.forEach(x => {
            const msg = (x as any).m as Message;
            msg.content = x.data;
            msg.decrypted = true;
            list.push(msg);
          });
          this.messages = list;
          setTimeout(() => {
            this.messagesWrapper!.nativeElement.scroll({ top: this.messagesWrapper!.nativeElement.scrollHeight });
          });
        });
      })
    );
  }
}
