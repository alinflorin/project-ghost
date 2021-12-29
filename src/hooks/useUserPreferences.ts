import { UserPreferences } from '../models/user-preferences';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuth } from './useAuth';
import { getDocumentRef, upsertDocument } from '../services/firebase';
import { useCallback } from 'react';
export const useUserPreferences = (): [UserPreferences | null, (prefs: Partial<UserPreferences>) => Promise<void>, boolean] => {
    const [user, userLoading] = useAuth();
    const [doc, docLoading] = useDocumentData(user == null ? null : getDocumentRef(`userPreferences/${user?.email}`));

    const setUserPreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
        if (user == null) {
            return;
        }
        await upsertDocument(getDocumentRef(`userPreferences/${user!.email}`), prefs);
    }, [user]);

    return [
        doc as UserPreferences,
        setUserPreferences,
        userLoading || docLoading
    ];
};

export default useUserPreferences;