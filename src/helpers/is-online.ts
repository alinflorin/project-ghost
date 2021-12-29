import { Timestamp } from 'firebase/firestore';
import { environment } from '../environment';

export const isOnline = (date?: Timestamp) => {
    if (date == null) {
        return false;
    }
    const now = new Date();
    return now.getTime() - date!.toMillis() < environment.heartbeat + 1000;
};