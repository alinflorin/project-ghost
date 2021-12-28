import {
  IImageStyles,
  Image,
  ITextFieldStyles,
  Link,
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
import useQueryParams from "../hooks/useQueryParams";
import useResponsive from "../hooks/useResponsive";

const inputStyles: Partial<ITextFieldStyles> = {
  root: {
    width: "100%",
  },
};

const socialImageStyles: Partial<IImageStyles> = {
  image: { width: "100%", height: "100%" },
  root: {
    width: "100%",
    height: "100%",
    maxWidth: "64px",
    cursor: "pointer",
  },
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("ui.login.emailRequired")
    .email("ui.login.invalidEmail"),
  password: yup
    .string()
    .required("ui.login.passwordRequired")
    .min(8, "ui.login.passwordTooShort"),
});

export const Login = () => {
  const { t, i18n } = useTranslation();
  const { control, handleSubmit, formState, setError, getValues, clearErrors } =
    useForm({
      resolver: yupResolver(schema),
      mode: "all",
    });

  const router = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const qp = useQueryParams();

  let returnTo: string | null = null;
  if (qp.has("returnTo")) {
    returnTo = qp.get("returnTo");
  }

  const msg: string[] = [];

  if (qp.has("message")) {
    msg.push(qp.get("message")!);
  }

  const [messages, setMessages] = useState<string[]>(msg);

  const { isMobile, isLargeOrHigher } = useResponsive();

  const onSubmit = useCallback(
    async (request: any) => {
      setIsLoading(true);
      try {
        setIsLoading(false);
        if (returnTo != null) {
          router(returnTo);
        } else {
          router("/dashboard");
        }
      } catch (err) {
        setIsLoading(false);
      }
    },
    [router, setIsLoading, returnTo, setError]
  );

  const resendActivationEmailClick = useCallback(async () => {
    try {
      clearErrors("global");
      const email = getValues("email");
      if (email == null) {
        return;
      }

      setMessages(() => ["ui.login.activationEmailSent"]);
    } catch (err) {}
  }, [setMessages, getValues, clearErrors, i18n, setError]);

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
          <Text variant="xxLarge">
            {t("ui.login.loginWithEmailAndPassword")}
          </Text>
          {formState.errors.global?.message && (
            <MessageBar
              messageBarType={MessageBarType.error}
              messageBarIconProps={{ iconName: "Error" }}
            >
              <div>{t(formState.errors.global?.message)}</div>
              {formState.errors.global.message.includes("userInactive") &&
                formState.errors.email == null && (
                  <Link onClick={resendActivationEmailClick}>
                    <Text variant="small">
                      {t("ui.login.resendActivationEmail")}
                    </Text>
                  </Link>
                )}
            </MessageBar>
          )}
          {messages.map((m, i) => (
            <MessageBar key={i} messageBarType={MessageBarType.info}>
              {t(m)}
            </MessageBar>
          ))}
          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                required={true}
                label={t("ui.login.email")}
                type="email"
                onChange={onChange}
                tabIndex={1}
                onBlur={onBlur}
                value={value ? value : ""}
                errorMessage={t(error?.message!)}
                iconProps={{ iconName: "Mail" }}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <TextField
                styles={inputStyles}
                required={true}
                label={t("ui.login.password")}
                onChange={onChange}
                tabIndex={2}
                onBlur={onBlur}
                value={value ? value : ""}
                errorMessage={t(error?.message!, { chars: 8 })}
                canRevealPassword
                type="password"
                iconProps={{ iconName: "PasswordField" }}
              />
            )}
          />

          <Stack
            horizontal={true}
            horizontalAlign="center"
            verticalAlign="center"
          >
            <PrimaryButton
              tabIndex={3}
              disabled={isLoading || (formState.isDirty && !formState.isValid)}
              type="submit"
            >
              {t("ui.login.login")}
            </PrimaryButton>
          </Stack>
          <Stack horizontal={true} horizontalAlign="end" verticalAlign="center">
            <RouterLink to="/forgot-password">
              <Text tabIndex={4} variant="small">
                {t("ui.login.forgotPassword")}
              </Text>
            </RouterLink>
          </Stack>
          <Stack horizontal={true} horizontalAlign="end" verticalAlign="center">
            <RouterLink
              to={
                returnTo == null
                  ? "/signup"
                  : `/signup?returnTo=${encodeURIComponent(returnTo)}`
              }
            >
              <Text tabIndex={5} variant="small">
                {t("ui.login.noAccountSignUp")}
              </Text>
            </RouterLink>
          </Stack>

          <Text style={{ marginTop: "1rem" }} variant="xxLarge">
            {t("ui.login.loginWithSocial")}
          </Text>
          <Stack
            horizontal={true}
            horizontalAlign="space-between"
            verticalAlign="center"
          >
            <Image
              tabIndex={6}
              styles={socialImageStyles}
              src="/images/google.png"
            />
            <Image
              tabIndex={7}
              styles={socialImageStyles}
              src="/images/facebook.png"
            />
            <Image
              tabIndex={8}
              styles={socialImageStyles}
              src="/images/microsoft.png"
            />
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};
export default Login;
