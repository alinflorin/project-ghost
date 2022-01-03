import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { RsaWorkerMessage } from '../models/rsa-worker-message';

@Injectable({
  providedIn: 'root'
})
export class RsaService {
  private i = 0;
  private worker: Worker;
  private subjects = new Map<string, Subject<RsaWorkerMessage>>();

  constructor() {
    this.worker = new Worker(new URL('../workers/rsa.worker', import.meta.url));

    this.worker.onmessage = ({ data }) => {
      if (data.isError) {
        this.subjects.get(data.id)?.error(data);
        this.subjects.get(data.id)?.complete();
        this.subjects.delete(data.id);
      } else {
        this.subjects.get(data.id)?.next(data);
        this.subjects.get(data.id)?.complete();
        this.subjects.delete(data.id);
      }
    };
    this.worker.onerror = (e: any) => {
      if (e.id) {
        this.subjects.get(e.id)?.error(e);
        this.subjects.get(e.id)?.complete();
        this.subjects.delete(e.id);
      }
    };
  }

  sendAndGetResponse(msg: RsaWorkerMessage) {
    msg.id = this.generateId();
    const subj = new Subject<RsaWorkerMessage>();
    this.subjects.set(msg.id, subj);
    this.worker.postMessage(msg);
    return subj.asObservable();
  }

  private generateId() {
    if (this.i >= 1000000) {
      this.i = -1;
    }
    return `${++this.i}`;
  }
}
