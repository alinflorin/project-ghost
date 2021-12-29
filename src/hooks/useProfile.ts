import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuth } from './useAuth';
import { getDocumentRef, upsertDocument } from '../services/firebase';
import { useCallback } from 'react';
import { Profile } from '../models/profile';
export const useProfile = (skipLoading = false): [Profile | null, (profile: Partial<Profile>) => Promise<void>, boolean] => {
    const [user, userLoading] = useAuth();
    let doc = null;
    let docLoading = false;

    if (!skipLoading) {
        const result = useDocumentData(user == null ? null : getDocumentRef(`profiles/${user?.email}`));
        doc = result[0];
        docLoading = result[1];
    }
    const setProfile = useCallback(async (profile: Partial<Profile>) => {
        if (user == null) {
            return;
        }
        await upsertDocument(getDocumentRef(`profiles/${user.email}`), profile);
    }, [user]);

    return [
        doc as Profile,
        setProfile,
        userLoading || docLoading
    ];
};

export default useProfile;