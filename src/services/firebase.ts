import { environment } from '../environment';
import { initializeApp } from 'firebase/app';
import {
    AuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup,
    GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signOut, createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { collection, doc, DocumentReference, getFirestore, setDoc, WithFieldValue } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { LoginRequest } from '../models/login-request';
import { SocialAccountType } from '../models/social-account-type';
import { SignupRequest } from '../models/signup-request';


export const firebaseApp = initializeApp(environment.firebase);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

export const signup = async (dto: SignupRequest) => {
    const user = await createUserWithEmailAndPassword(firebaseAuth, dto.email, dto.password1);
    await updateProfile(user.user, {
        displayName: `${dto.firstName} ${dto.lastName}`
    });
    return user;
};

export const loginWithEmailAndPassword = async (dto: LoginRequest) => {
    return await signInWithEmailAndPassword(firebaseAuth, dto.email, dto.password);
};

export const loginWithSocialAccount = async (type: SocialAccountType) => {
    let provider: AuthProvider;
    switch (type) {
        default:
        case SocialAccountType.Google:
            provider = new GoogleAuthProvider();
            break;
        case SocialAccountType.Facebook:
            provider = new FacebookAuthProvider();
            break;
        case SocialAccountType.Microsoft:
            provider = new OAuthProvider('microsoft.com');
            break;
    }

    return await signInWithPopup(firebaseAuth, provider);
};

export const logout = async () => {
    await signOut(firebaseAuth);
};

export const getCollection = (collectionName: string) => {
    return collection(firebaseFirestore, collectionName);
};

export const getDocument = (path: string) => {
    return doc(firebaseFirestore, path);
};

export const upsertDocument = async <T>(ref: DocumentReference<T>, data: WithFieldValue<T>) => {
    setDoc(ref, data);
};
