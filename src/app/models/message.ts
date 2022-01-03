import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  id?: string;
  from: string;
  to: string;
  sentDate: Timestamp;
  seenDate: Timestamp | null;
  content: string;
  decrypted?: boolean;
}
