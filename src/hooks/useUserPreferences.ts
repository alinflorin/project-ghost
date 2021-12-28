import { useAuth } from './useAuth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { getDocument, upsertDocument } from '../services/firebase';
import { useCallback } from 'react';
import { UserPreferences } from '../models/user-preferences';
import { DocumentData } from 'firebase/firestore';
export const useUserPreferences = () => {
    const [user, authLoading] = useAuth();
    const [doc, docLoading, docError] = useDocument(
        authLoading || user == null ? null : getDocument(`userPreferences/${user!.email}`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const setPreferences = useCallback(async (newPref: UserPreferences) => {
        if (authLoading || docLoading || doc == null) {
            return;
        }
        const docRef = doc!.ref;
        let pref = {} as UserPreferences;
        if (doc.exists()) {
            pref = { ...doc.data() };
        }
        pref = { ...pref, ...newPref };
        upsertDocument<DocumentData>(docRef, pref as any);
    },
        [user, authLoading, docLoading, doc]);


    const preferences = ((doc == null || !doc!.exists()) ? null : (doc!.data() as UserPreferences | null));

    return {
        preferences,
        setPreferences
    };
};
export default useUserPreferences;