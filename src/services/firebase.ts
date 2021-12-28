import { environment } from '../environment';
import { initializeApp } from 'firebase/app';
import {
    AuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup,
    GoogleAuthProvider, FacebookAuthProvider, OAuthProvider
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { LoginRequest } from '../models/login-request';
import { SocialAccountType } from '../models/social-account-type';


export const firebaseApp = initializeApp(environment.firebase);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

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