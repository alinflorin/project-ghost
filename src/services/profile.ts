import { serverTimestamp } from 'firebase/firestore';
import { Profile } from '../models/profile';
import { getDocumentRef, upsertDocument } from './firebase';

export const updateProfileLastSeen = async (email: string) => {
    await upsertDocument(getDocumentRef(`profiles/${email}`), {
        lastSeen: serverTimestamp()
    });
};

export const updateProfile = async (email: string, data: Partial<Profile>) => {
    await upsertDocument(getDocumentRef(`profiles/${email}`), data);
};