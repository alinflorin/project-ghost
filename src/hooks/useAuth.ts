import { firebaseAuth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
export const useAuth = () => {
    return useAuthState(firebaseAuth);
};