import {
  ITextFieldStyles,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { addErrorsToFormState } from "../helpers/form-state";

import RouterLink from "../helpers/router-link";
import useResponsive from "../hooks/useResponsive";
import { ResetPasswordRequest } from "../models/reset-password-request";
import { sendResetEmail } from "../services/firebase";

const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: "100%",
  },
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("ui.forgotPassword.emailRequired")
    .email("ui.forgotPassword.invalidEmail"),
});

export const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const { control, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const router = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isMobile, isLargeOrHigher } = useResponsive();

  const onSubmit = useCallback(
    async (request: ResetPasswordRequest) => {
      setIsLoading(true);
      try {
        await sendResetEmail(request);
        setIsLoading(false);
        router("/login?message=ui.login.passwordRecoveryEmailSent");
      } catch (err) {
        setIsLoading(false);
        addErrorsToFormState(setError, err);
      }
    },
    [router, setIsLoading, setError, i18n]
  );

  return (
    <Stack verticalFill={true}>
      <form
        autoComplete="off"
        className="mx-auto my-auto"
        style={{ width: isMobile ? "100%" : isLargeOrHigher ? "25%" : "50%" }}
        noValidate={true}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack tokens={{ childrenGap: 10 }} verticalFill={true} grow={true}>
          <Text variant="xxLarge">{t("ui.forgotPassword.forgotPassword")}</Text>
          {formState.errors.global?.message && (
            <MessageBar
              messageBarType={MessageBarType.error}
              messageBarIconProps={{ iconName: "Error" }}
            >
              {t(formState.errors.global?.message)}
            </MessageBar>
          )}
          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                label={t("ui.forgotPassword.email")}
                type="email"
                required={true}
                onChange={onChange}
                onBlur={onBlur}
                value={value ? value : ""}
                errorMessage={t(error?.message!)}
                iconProps={{ iconName: "Mail" }}
              />
            )}
          />

          <Stack
            horizontal={true}
            horizontalAlign="center"
            verticalAlign="center"
          >
            <PrimaryButton
              disabled={isLoading || (formState.isDirty && !formState.isValid)}
              type="submit"
            >
              {t("ui.forgotPassword.sendRecoveryEmail")}
            </PrimaryButton>
          </Stack>
          <Stack horizontal={true} horizontalAlign="end" verticalAlign="center">
            <RouterLink to="/login">
              <Text variant="small">{t("ui.forgotPassword.backToLogin")}</Text>
            </RouterLink>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
export default ForgotPassword;
