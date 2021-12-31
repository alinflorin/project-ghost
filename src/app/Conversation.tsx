import {
  Checkbox,
  Persona,
  PersonaPresence,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { query } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { isOnline } from "../helpers/is-online";
import { useAuth } from "../hooks/useAuth";
import { Profile } from "../models/profile";
import { getCollection, getDocumentRef } from "../services/firebase";

const getInitials = (n: string | null) => {
  if (n == null || n.length === 0) {
    return "U";
  }
  return n
    .split(" ")
    .map((x) => x[0].toUpperCase())
    .join("");
};

const getConversationKey = (email1: string, email2: string) => {
  return [email1, email2].sort().join("_");
};

export const Conversation = () => {
  const [user, userLoading] = useAuth();
  const [key, setKey] = useState<string | undefined>();
  const params = useParams();

  const [tempKey, setTempKey] = useState<string | undefined>();
  const [persist, setPersist] = useState<boolean>(false);

  useEffect(() => {
    const lsKey = localStorage.getItem("key_" + params.friendEmail);
    if (lsKey != null) {
      setKey(lsKey);
    }
  }, [params.friendEmail, setKey]);

  const [t] = useTranslation();
  const [friendProfile, friendProfileLoading] = useDocumentData<Profile>(
    getDocumentRef(`profiles/${params.friendEmail}`)
  );

  const saveKey = useCallback(() => {
    setKey(tempKey!);
    if (persist) {
      localStorage.setItem("key_" + params.friendEmail, tempKey!);
    }
  }, [setKey, tempKey, persist, params.friendEmail]);

  const [messages, messagesLoading] = useCollectionData(
    key == null || userLoading || user == null
      ? null
      : query(
          getCollection(
            `conversations/${getConversationKey(
              user!.email!,
              params.friendEmail!
            )}/messages`
          )
        )
  );

  return (
    <>
      {!friendProfileLoading && friendProfile && (
        <Stack horizontal={false} verticalFill={true}>
          <Stack
            tokens={{
              childrenGap: "1rem",
            }}
            horizontal={true}
            styles={{ root: { width: "100%" } }}
          >
            <Persona
              imageUrl={friendProfile.photo || undefined}
              imageInitials={getInitials(friendProfile.displayName || null)}
              text={friendProfile.displayName || undefined}
              key={isOnline(friendProfile!.lastSeen).toString()}
              presence={
                isOnline(friendProfile!.lastSeen)
                  ? PersonaPresence.online
                  : PersonaPresence.offline
              }
              hidePersonaDetails={true}
            />
            <Stack verticalAlign="center" horizontal={false} grow={true}>
              <Text variant="xLarge">{friendProfile.displayName}</Text>
              <Text variant="small">
                {isOnline(friendProfile!.lastSeen)
                  ? t("ui.conversation.online")
                  : friendProfile!.lastSeen == null
                  ? t("ui.conversation.offline")
                  : t("ui.conversation.lastSeenAt") +
                    " " +
                    friendProfile!.lastSeen!.toDate().toLocaleString()}
              </Text>
            </Stack>
          </Stack>

          {!key && (
            <Stack
              horizontal={false}
              verticalFill={true}
              styles={{ root: { minHeight: 0, overflow: "auto" } }}
            >
              <Stack
                horizontalAlign="center"
                horizontal={false}
                tokens={{ childrenGap: "1rem" }}
                styles={{ root: { margin: "auto" } }}
              >
                <TextField
                  iconProps={{ iconName: "PasswordField" }}
                  type="password"
                  value={tempKey || ""}
                  onChange={(e) => setTempKey((e.target as any).value)}
                  label={t("ui.conversation.key")}
                />
                <Checkbox
                  checked={persist}
                  onChange={(e) => setPersist((e!.target as any).checked)}
                  label={t("ui.conversation.persist")}
                />
                <PrimaryButton
                  disabled={!tempKey}
                  onClick={saveKey}
                  text={t("ui.conversation.go")}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};
export default Conversation;
