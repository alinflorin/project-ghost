import { Timestamp } from 'firebase/firestore';

export interface Message {
    id: string;
    from: string;
    to: string;
    sentDate: Timestamp;
    seenDate?: Timestamp;
    content: string;
}