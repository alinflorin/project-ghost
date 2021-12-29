import {
  Checkbox,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
} from "@fluentui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { addErrorsToFormState } from "../helpers/form-state";
import useUserPreferences from "../hooks/useUserPreferences";
import { UserPreferences } from "../models/user-preferences";

const schema = yup.object().shape({
  disableLastSeen: yup.boolean(),
});

export const Settings = () => {
  const { t, i18n } = useTranslation();

  const [userPreferences, setUserPreferences, userPreferencesLoading] =
    useUserPreferences();

  const { control, handleSubmit, formState, setError, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const formValuesSet = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (
      formValuesSet.current ||
      userPreferencesLoading ||
      userPreferences == null
    ) {
      return;
    }
    setValue("disableLastSeen", userPreferences.disableLastSeen || false);
    formValuesSet.current = true;
  }, [userPreferences, userPreferencesLoading, formValuesSet, setValue]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (payload: Partial<UserPreferences>) => {
      setIsLoading(true);
      try {
        await setUserPreferences(payload);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        addErrorsToFormState(setError, err);
      }
    },
    [setIsLoading, setError, i18n, setUserPreferences]
  );

  return (
    <Stack verticalFill={true}>
      <form
        autoComplete="off"
        noValidate={true}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack tokens={{ childrenGap: 10 }} verticalFill={true} grow={true}>
          <Text variant="xxLarge">{t("ui.settings.settings")}</Text>
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
            name="disableLastSeen"
            render={({ field: { onChange, onBlur, value } }) => (
              <Checkbox
                disabled={isLoading}
                label={t("ui.settings.disableLastSeen")}
                onChange={async (e) => {
                  onChange(e);
                  await handleSubmit(onSubmit)();
                }}
                checked={value || false}
              />
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
};
export default Settings;
