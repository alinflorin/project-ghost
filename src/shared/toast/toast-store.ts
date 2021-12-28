import { BehaviorSubject } from '../../helpers/behavior-subject';
import { ToastMessage } from './toast-message';

export interface ToastState {
	messages: ToastMessage[];
}
export const ToastStore = new BehaviorSubject<ToastState>({
	messages: [],
});
export default ToastStore;
