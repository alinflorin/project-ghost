import { IconButton, Stack } from "@fluentui/react";
import { useTranslation } from "react-i18next";

export const Contacts = () => {
  const [t, i18n] = useTranslation();

  return (
    <Stack
      style={{ position: "relative" }}
      horizontal={false}
      verticalFill={true}
    >
      <IconButton
        styles={{ root: { position: "absolute", bottom: 0, right: 0 } }}
        iconProps={{
          iconName: "Add",
        }}
      />
    </Stack>
  );
};
export default Contacts;
