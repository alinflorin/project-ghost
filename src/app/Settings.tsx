import {
  Checkbox,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { addErrorsToFormState } from "../helpers/form-state";

const schema = yup.object().shape({
  disableLastSeen: yup.boolean(),
});

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const { control, handleSubmit, formState, setError } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      addErrorsToFormState(setError, err);
    }
  }, [setIsLoading, setError, i18n]);

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
                label={t("ui.settings.disableLastSeen")}
                onChange={onChange}
                checked={value}
              />
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
};
export default Settings;
