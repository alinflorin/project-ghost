import type { FieldValues, UseFormSetError } from 'react-hook-form';

export const addErrorsToFormState = (
	setError: UseFormSetError<FieldValues>,
	errors: string[]
) => {
	for (const error of errors) {
		setError('global', { message: error });
	}
};
