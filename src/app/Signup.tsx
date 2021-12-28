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

import RouterLink from "../helpers/router-link";
import { useQueryParams } from "../hooks/useQueryParams";
import useResponsive from "../hooks/useResponsive";

const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: "100%",
  },
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("ui.signup.emailRequired")
    .email("ui.signup.invalidEmail"),
  password1: yup
    .string()
    .required("ui.signup.passwordRequired")
    .min(8, "ui.signup.passwordTooShort"),
  password2: yup
    .string()
    .required("ui.signup.passwordConfirmationRequired")
    .min(8, "ui.signup.passwordTooShort")
    .oneOf([yup.ref("password1")], "ui.signup.passwordsMustMatch"),
  firstName: yup.string().required("ui.signup.firstNameRequired"),
  lastName: yup.string().required("ui.signup.lastNameRequired"),
});

export const Signup = () => {
  const { t, i18n } = useTranslation();
  const { control, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const router = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isMobile, isLargeOrHigher } = useResponsive();

  const qp = useQueryParams();

  let returnTo: string | null = null;
  if (qp.has("returnTo")) {
    returnTo = qp.get("returnTo");
  }

  const onSubmit = useCallback(
    async (request: any) => {
      setIsLoading(true);
      try {
        request.languageCode = i18n.language;
        request.returnTo = returnTo;
        setIsLoading(false);
        router("/login?message=ui.login.accountCreatedPleaseActivate");
      } catch (err) {
        setIsLoading(false);
      }
    },
    [setIsLoading, router, i18n, setError, returnTo]
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
          <Text variant="xxLarge">{t("ui.signup.signup")}</Text>
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
                label={t("ui.signup.email")}
                type="email"
                required={true}
                tabIndex={1}
                onChange={onChange}
                onBlur={onBlur}
                value={value ? value : ""}
                errorMessage={t(error?.message!)}
                iconProps={{ iconName: "Mail" }}
              />
            )}
          />

          <Controller
            control={control}
            name="password1"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                label={t("ui.signup.password")}
                onChange={onChange}
                onBlur={onBlur}
                required={true}
                tabIndex={2}
                value={value ? value : ""}
                errorMessage={t(error?.message!, { chars: 8 })}
                canRevealPassword
                type="password"
                iconProps={{ iconName: "PasswordField" }}
              />
            )}
          />

          <Controller
            control={control}
            name="password2"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                label={t("ui.signup.passwordConfirmation")}
                onChange={onChange}
                onBlur={onBlur}
                tabIndex={3}
                required={true}
                value={value ? value : ""}
                errorMessage={t(error?.message!, { chars: 8 })}
                canRevealPassword
                type="password"
                iconProps={{ iconName: "PasswordField" }}
              />
            )}
          />

          <Controller
            control={control}
            name="firstName"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                label={t("ui.signup.firstName")}
                type="text"
                onChange={onChange}
                onBlur={onBlur}
                tabIndex={4}
                required={true}
                value={value ? value : ""}
                errorMessage={t(error?.message!)}
                iconProps={{ iconName: "ReminderPerson" }}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                label={t("ui.signup.lastName")}
                type="text"
                onChange={onChange}
                onBlur={onBlur}
                required={true}
                tabIndex={5}
                value={value ? value : ""}
                errorMessage={t(error?.message!)}
                iconProps={{ iconName: "ReminderPerson" }}
              />
            )}
          />

          <Stack
            horizontal={true}
            horizontalAlign="center"
            verticalAlign="center"
          >
            <PrimaryButton
              tabIndex={6}
              disabled={isLoading || (formState.isDirty && !formState.isValid)}
              type="submit"
            >
              {t("ui.signup.signup")}
            </PrimaryButton>
          </Stack>
          <Stack horizontal={true} horizontalAlign="end" verticalAlign="center">
            <RouterLink to="/login">
              <Text tabIndex={7} variant="small">
                {t("ui.signup.alreadyHaveAccountLogin")}
              </Text>
            </RouterLink>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
export default Signup;
