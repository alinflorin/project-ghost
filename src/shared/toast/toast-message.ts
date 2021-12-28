import { ToastSeverity } from './toast-severity';

export interface ToastMessage {
	title?: string;
	message: string;
	severity: ToastSeverity;
	onClick?: () => void | Promise<void>;
	timeoutHandle?: any;
}
