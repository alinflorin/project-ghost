import {
  CheckboxVisibility,
  CommandBar,
  ICommandBarItemProps,
  Persona,
  PersonaPresence,
  PersonaSize,
  Selection,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
} from "@fluentui/react";
import { useAuth } from "../hooks/useAuth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { query, where } from "firebase/firestore";
import { deleteDocument, getCollection } from "../services/firebase";
import { isOnline } from "../helpers/is-online";
import useSubjectState from "../hooks/useSubjectState";
import HeaderStore from "../layout/header-store";
import { useTranslation } from "react-i18next";
import useWindowSize from "../hooks/useWindowSize";
import { useCallback, useMemo, useState } from "react";
import { Profile } from "../models/profile";
import AddContact from "./AddContact";

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
  const [t, i18n] = useTranslation();
  const [headerState] = useSubjectState(HeaderStore);
  const windowSize = useWindowSize();
  const [user, userLoading] = useAuth();
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [contactsEmails, contactEmailsLoading] = useCollectionData(
    userLoading || user == null
      ? null
      : query(getCollection(`contacts/${user.email}/userContacts`)),
    {
      idField: "email",
    }
  );

  const [profiles, profilesLoading] = useCollectionData(
    contactEmailsLoading || contactsEmails == null
      ? null
      : query(
          getCollection(`profiles`),
          where(
            "email",
            "in",
            contactsEmails == null || contactsEmails.length === 0
              ? [""]
              : contactsEmails!.map((x) => x.email)
          )
        ),
    {
      idField: "email",
    }
  );

  const [selectedItems, setSelectedItems] = useState<Profile[]>([]);

  const selection = new Selection({
    selectionMode: SelectionMode.multiple,
    onSelectionChanged: () => {
      setSelectedItems(selection.getSelection() as Profile[]);
    },
  });

  const deleteSelectedContacts = useCallback(async () => {
    return Promise.all(
      selectedItems.map((si) =>
        deleteDocument(`contacts/${user!.email}/userContacts/${si.email}`)
      )
    );
  }, [selectedItems, user]);

  const showAddContact = useCallback(() => {
    setAddContactVisible(true);
  }, [setAddContactVisible]);

  const commandItems = useMemo(() => {
    return [
      {
        key: "add",
        text: t("ui.contacts.add"),
        iconProps: { iconName: "Add" },
        onClick: showAddContact,
      },
      {
        key: "delete",
        text: t("ui.contacts.delete"),
        iconProps: { iconName: "Delete" },
        disabled: selectedItems.length === 0,
        onClick: deleteSelectedContacts,
      },
    ] as ICommandBarItemProps[];
  }, [t, i18n.language, selectedItems]);

  const addContactDismissed = useCallback(() => {
    setAddContactVisible(false);
  }, [setAddContactVisible]);

  return (
    <>
      <Stack
        style={{ position: "relative" }}
        horizontal={false}
        verticalFill={true}
      >
        <CommandBar items={commandItems} styles={{ root: { padding: 0 } }} />
        <Stack
          styles={{
            root: { flex: "1 1 auto", minHeight: "0", overflow: "auto" },
          }}
          horizontal={false}
        >
          <ShimmeredDetailsList
            key={headerState.isNavOpen + "_" + windowSize.width}
            items={profiles == null ? [] : profiles}
            enableShimmer={profilesLoading}
            shimmerLines={10}
            compact={false}
            checkboxVisibility={CheckboxVisibility.always}
            enableUpdateAnimations={true}
            isHeaderVisible={false}
            setKey="email"
            checkboxCellClassName="fullCheckbox"
            columns={[
              {
                key: "email",
                name: "",
                minWidth: 0,
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
            selection={selection}
          />
        </Stack>
      </Stack>
      <AddContact
        user={user}
        visible={addContactVisible}
        onDismiss={addContactDismissed}
      />
    </>
  );
};
export default Contacts;
