import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuth } from './useAuth';
import { getDocumentRef, upsertDocument } from '../services/firebase';
import { useCallback } from 'react';
import { Profile } from '../models/profile';
export const useProfile = (): [Profile | null, (profile: Partial<Profile>) => Promise<void>, boolean] => {
    const [user, userLoading] = useAuth();
    const [doc, docLoading] = useDocumentData(user == null ? null : getDocumentRef(`profiles/${user?.email}`));

    const setProfile = useCallback(async (profile: Partial<Profile>) => {
        if (user == null) {
            return;
        }
        await upsertDocument(getDocumentRef(`profiles/${user!.email}`), profile);
    }, [user]);

    return [
        doc as Profile,
        setProfile,
        userLoading || docLoading
    ];
};

export default useProfile;