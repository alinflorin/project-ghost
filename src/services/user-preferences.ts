import { UserPreferences } from '../models/user-preferences';
import { getDocument, getDocumentRef, upsertDocument } from './firebase';

export const getUserPreferences = async (email: string) => {
    const doc = await getDocument(`userPreferences/${email}`);
    if (!doc.exists()) {
        return null;
    }
    return doc.data() as UserPreferences;
};

export const updateUserPreferences = async (email: string, up: Partial<UserPreferences>) => {
    await upsertDocument(getDocumentRef(`userPreferences/${email}`), up);
};