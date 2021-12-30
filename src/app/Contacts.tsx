import {
  IconButton,
  Persona,
  PersonaPresence,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
} from "@fluentui/react";
import { useAuth } from "../hooks/useAuth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, where } from "firebase/firestore";
import { getCollection } from "../services/firebase";
import { isOnline } from "../helpers/is-online";
import useSubjectState from "../hooks/useSubjectState";
import HeaderStore from "../layout/header-store";
import useResponsive from "../hooks/useResponsive";

const getInitials = (n: string | null) => {
  if (n == null || n.length === 0) {
    return "U";
  }
  return n
    .split(" ")
    .map((x) => x[0].toUpperCase())
    .join("");
};

export const Contacts = () => {
  const [headerState] = useSubjectState(HeaderStore);
  const { isMobile } = useResponsive();
  const [user, userLoading] = useAuth();
  const [contactsEmails, contactEmailsLoading] = useCollectionData(
    userLoading || user == null
      ? null
      : query(getCollection(`contacts/${user.email}/userContacts`)),
    {
      idField: "email",
    }
  );

  const [profiles] = useCollectionData(
    contactEmailsLoading || contactsEmails == null
      ? null
      : query(
          getCollection(`profiles`),
          where(
            "email",
            "in",
            contactsEmails!.map((x) => x.email)
          )
          // orderBy("displayName", "asc")
        ),
    {
      idField: "email",
    }
  );

  return (
    <Stack
      style={{ position: "relative" }}
      horizontal={false}
      verticalFill={true}
    >
      {profiles && (
        <ShimmeredDetailsList
          key={headerState.isNavOpen + "_" + isMobile}
          styles={{ root: { flex: "1 1 auto" } }}
          items={profiles!}
          checkboxCellClassName="fullCheckbox"
          columns={[
            {
              key: "email",
              name: "email",
              minWidth: 100,
              onRender: (data) => (
                <Stack
                  horizontal={true}
                  verticalAlign="center"
                  horizontalAlign="start"
                  tokens={{
                    childrenGap: "1rem",
                  }}
                >
                  <Persona
                    imageUrl={data.photo || undefined}
                    imageInitials={getInitials(data.displayName)}
                    text={data.displayName || undefined}
                    size={PersonaSize.size32}
                    presence={
                      isOnline(data?.lastSeen)
                        ? PersonaPresence.online
                        : PersonaPresence.offline
                    }
                    hidePersonaDetails={true}
                  />
                  <Stack horizontal={false}>
                    <Text variant="large">{data.displayName}</Text>
                    <Text variant="small">{data.email}</Text>
                  </Stack>
                </Stack>
              ),
            },
          ]}
          selectionMode={SelectionMode.multiple}
        />
      )}
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
