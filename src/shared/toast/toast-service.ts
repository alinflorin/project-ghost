import { environment } from '../../environment';
import { ToastMessage } from './toast-message';
import { ToastSeverity } from './toast-severity';
import ToastStore from './toast-store';

const state = ToastStore;

export const remove = (messageEntity: ToastMessage) => {
    if (messageEntity.timeoutHandle != null) {
        clearTimeout(messageEntity.timeoutHandle);
    }
    const list = state.getValue().messages;
    list.splice(list.indexOf(messageEntity), 1);
    state.next({ messages: list });
};

export const show = (
    message: string,
    title: string | undefined = undefined,
    severity = ToastSeverity.Info,
    onClick: (() => void | Promise<void>) | undefined = undefined,
    timeout: number = environment.toastTimeout
) => {
    const messageEntity: ToastMessage = {
        message: message,
        title: title,
        severity: severity,
        onClick: onClick,
    };
    if (timeout != null) {
        messageEntity.timeoutHandle = setTimeout(() => {
            remove(messageEntity);
        }, timeout);
    }
    const list = state.getValue().messages;
    list.push(messageEntity);
    state.next({ messages: list });
    return messageEntity;
};

export const showError = (message: string, title: string | undefined = undefined) => {
    return show(message, title, ToastSeverity.Error);
};

export const showWarning = (message: string, title: string | undefined = undefined) => {
    return show(message, title, ToastSeverity.Warn);
};

export const showSuccess = (message: string, title: string | undefined = undefined) => {
    return show(message, title, ToastSeverity.Success);
};

export const showInfo = (message: string, title: string | undefined = undefined) => {
    return show(message, title, ToastSeverity.Info);
};
