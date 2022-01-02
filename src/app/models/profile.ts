import { Timestamp } from '@angular/fire/firestore';

export interface Profile {
  id?: string;
  lastSeen?: Timestamp;
  email?: string;
  displayName?: string;
  photo?: string;
}
