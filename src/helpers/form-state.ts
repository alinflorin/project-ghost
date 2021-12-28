import { FirebaseError } from 'firebase/app';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

export const addErrorsToFormState = (
	setError: UseFormSetError<FieldValues>,
	err: any
) => {
	if (err == null) {
		setError('global', { message: 'ui.errors.unknown' });
		return;
	}
	const firebaseError = err as FirebaseError;
	if (firebaseError == null || (firebaseError.code == null || firebaseError.message == null)) {
		setError('global', { message: 'ui.errors.unknown' });
		return;
	}

	if (firebaseError.code != null) {
		setError('global', { message: 'ui.errors.firebase.' + firebaseError.code });
		return;
	}

	if (firebaseError.message != null) {
		setError('global', { message: firebaseError.message });
	}
};
