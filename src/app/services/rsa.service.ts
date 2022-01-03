import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { RsaWorkerMessage } from '../models/rsa-worker-message';

@Injectable({
  providedIn: 'root'
})
export class RsaService {
  private worker: Worker;
  private workerSubject = new Subject<any>();
  constructor() {
    this.worker = new Worker(new URL('../workers/rsa.worker', import.meta.url));

    this.worker.onmessage = ({ data }) => {
      this.workerSubject.next(data);
    };
    this.worker.onerror = e => {
      this.workerSubject.error(e);
    };
  }

  asObservable() {
    return this.workerSubject.asObservable().pipe(
      map(x => x as RsaWorkerMessage)
    );
  }

  send(msg: RsaWorkerMessage) {
    this.worker.postMessage(msg);
  }
}
