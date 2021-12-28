import React from 'react';

const setTimeoutUntilTrueAndExecuteCallback = (
	evalFct: React.MutableRefObject<boolean>,
	callback: (value: void) => void,
	reject: (reason: any) => void,
	t = 10
) => {
	setTimeout(() => {
		if (evalFct.current) {
			callback();
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			setTimeoutUntilTrueAndExecuteCallback(evalFct, callback, reject, t);
		}
	}, t);
};

export const waitUntil = (
	evalFct: React.MutableRefObject<boolean>,
	t = 10
): Promise<void> => {
	if (evalFct.current) {
		return Promise.resolve();
	}
	return new Promise<void>((accept, reject) => {
		setTimeoutUntilTrueAndExecuteCallback(evalFct, accept, reject, t);
	});
};
