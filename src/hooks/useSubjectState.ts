import { useEffect, useState } from 'react';

import { BehaviorSubject } from '../helpers/behavior-subject';

export const useSubjectState = <T>(subject: BehaviorSubject<T>): [T, (v: T) => void] => {
	const val = subject == null ? null : subject.getValue();
	const [value, setState] = useState<T>(val as any);
	useEffect(() => {
		const sub = subject.subscribe((s) => setState(s));
		return () => sub.unsubscribe();
	});
	const newSetState = (state: T) => subject.next(state);
	return [value, newSetState];
};
export default useSubjectState;
