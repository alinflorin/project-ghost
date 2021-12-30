import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { User } from "firebase/auth";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import {
  getDocument,
  getDocumentRef,
  upsertDocument,
} from "../services/firebase";
import { showSuccess } from "../shared/toast/toast-service";

export interface AddContactProps {
  user?: User | null | undefined;
  visible?: boolean;
  onDismiss?: () => void;
}

const validation = yup.string().email("ui.contacts.invalidEmail");

export const AddContact = (props: AddContactProps) => {
  const [t] = useTranslation();
  const [email, setEmail] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();

  const onEmailChanged = useCallback(
    async (email: string) => {
      try {
        await validation.validate(email);
        setEmail(email);
        setEmailError(undefined);
      } catch (err) {
        const ve = err as yup.ValidationError;
        if (ve) {
          setEmailError(ve.message);
        }
      }
    },
    [setEmail, setEmailError]
  );

  const onDismiss = useCallback(() => {
    if (props.onDismiss) {
      props.onDismiss();
    }
  }, [props.onDismiss]);

  const addContact = useCallback(async () => {
    const foundProfile = await getDocument(`profiles/${email}`);

    if (!foundProfile.exists()) {
      setEmailError("ui.contacts.emailDoesntExist");
      return;
    }
    await upsertDocument(
      getDocumentRef(`contacts/${props.user!.email}/userContacts/${email}`),
      {}
    );
    onDismiss();
    showSuccess(t("ui.contacts.contactAdded"));
  }, [onDismiss, t, email, setEmailError, props.user]);

  return (
    <Dialog
      modalProps={{
        isDarkOverlay: true,
        isModeless: false,
      }}
      hidden={!props.visible}
      onDismiss={onDismiss}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: t("ui.contacts.addContact"),
      }}
    >
      <TextField
        label={t("ui.contacts.email")}
        iconProps={{ iconName: "Mail" }}
        errorMessage={emailError == null ? undefined : t(emailError)}
        onChange={(e) => onEmailChanged((e.target as any).value)}
      />
      <DialogFooter>
        <PrimaryButton
          disabled={email == null || email.length === 0 || emailError != null}
          onClick={addContact}
          text={t("ui.contacts.save")}
        />
        <DefaultButton onClick={onDismiss} text={t("ui.contacts.cancel")} />
      </DialogFooter>
    </Dialog>
  );
};
export default AddContact;
