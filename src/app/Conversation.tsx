import {
  Checkbox,
  IconButton,
  MessageBar,
  MessageBarType,
  Persona,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
  Separator,
  Shimmer,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import {
  CollectionReference,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { isOnline } from "../helpers/is-online";
import { useAuth } from "../hooks/useAuth";
import { Message } from "../models/message";
import { Profile } from "../models/profile";
import {
  getCollection,
  getDocumentRef,
  insertDocument,
} from "../services/firebase";

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

  const [userProfile] = useDocumentData<Profile>(
    userLoading || user == null
      ? null
      : getDocumentRef(`profiles/${user!.email}`)
  );

  const saveKey = useCallback(() => {
    setKey(tempKey!);
    if (persist) {
      localStorage.setItem("key_" + params.friendEmail, tempKey!);
    }
  }, [setKey, tempKey, persist, params.friendEmail]);

  const firstTimeLoading = useRef(true);

  const [messages, messagesLoading] = useCollectionData<Message>(
    key == null || userLoading || user == null
      ? null
      : query<Message>(
          getCollection(
            `conversations/${getConversationKey(
              user!.email!,
              params.friendEmail!
            )}/messages`
          ) as CollectionReference<Message>,
          orderBy("sentDate", "asc")
        ),
    {
      snapshotOptions: {
        serverTimestamps: "estimate",
      },
    }
  );

  useEffect(() => {
    if (!messagesLoading && firstTimeLoading.current) {
      firstTimeLoading.current = false;
    }
  }, [messagesLoading, firstTimeLoading]);

  const [text, setText] = useState<string | undefined>();

  const send = useCallback(async () => {
    const message: Message = {
      content: text!,
      from: user!.email!,
      to: params.friendEmail!,
      seenDate: null,
      sentDate: serverTimestamp() as any,
    };
    await insertDocument(
      getCollection(
        `conversations/${getConversationKey(
          user!.email!,
          params.friendEmail!
        )}/messages`
      ),
      message
    );
    setText(undefined);
  }, [user, params.friendEmail, text, setText]);

  const getProfile = useCallback(
    (email: string) => {
      if (email === user!.email) {
        return userProfile;
      } else {
        return friendProfile;
      }
    },
    [userProfile, friendProfile]
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
          <Separator />
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

          {key && (
            <>
              <Stack
                horizontal={false}
                verticalFill={true}
                styles={{ root: { overflow: "auto", minHeight: "0" } }}
              >
                {firstTimeLoading.current && (
                  <Stack horizontal={false} tokens={{ childrenGap: "1rem" }}>
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                    <Shimmer />
                  </Stack>
                )}
                {!firstTimeLoading.current && (
                  <Stack
                    horizontal={false}
                    horizontalAlign="start"
                    verticalAlign="start"
                    styles={{ root: { width: "100%" } }}
                  >
                    {messages != null &&
                      messages.length > 0 &&
                      messages.map((msg, i) => (
                        <Stack
                          horizontal={true}
                          horizontalAlign={
                            msg.from === user?.email ? "end" : "start"
                          }
                          key={i + ""}
                          styles={{ root: { width: "100%" } }}
                        >
                          <MessageBar
                            messageBarIconProps={{ iconName: undefined }}
                            messageBarType={
                              msg.from === user?.email
                                ? MessageBarType.success
                                : MessageBarType.info
                            }
                            styles={{
                              iconContainer: {
                                display: "none",
                              },
                              root: {
                                minWidth: "50px",
                                maxWidth: "50%",
                                width: "auto !important",
                                wordBreak: "break-all !important",
                              },
                            }}
                          >
                            <Stack
                              horizontal={true}
                              verticalAlign="start"
                              tokens={{ childrenGap: "1rem" }}
                            >
                              <Persona
                                imageUrl={
                                  getProfile(msg.from)!.photo || undefined
                                }
                                imageInitials={getInitials(
                                  getProfile(msg.from)!.displayName!
                                )}
                                text={
                                  getProfile(msg.from)!.displayName || undefined
                                }
                                size={PersonaSize.size32}
                                presence={PersonaPresence.none}
                                hidePersonaDetails={true}
                              />
                              <p>{msg.content}</p>
                            </Stack>
                            <Stack
                              horizontal={true}
                              grow={true}
                              horizontalAlign="start"
                            >
                              <Text
                                variant="tiny"
                                styles={{ root: { color: "black" } }}
                              >
                                {msg.sentDate!.toDate().toLocaleString()}
                              </Text>
                            </Stack>
                          </MessageBar>
                        </Stack>
                      ))}
                  </Stack>
                )}
              </Stack>
              <Stack
                verticalAlign="center"
                tokens={{
                  childrenGap: "1rem",
                }}
                horizontal={true}
                styles={{ root: { width: "100%" } }}
              >
                <TextField
                  multiline={true}
                  value={text || ""}
                  onChange={(e) => setText((e.target as any).value)}
                  styles={{
                    root: {
                      flex: "1 1 auto",
                    },
                  }}
                />
                <IconButton
                  disabled={text == null || text.length === 0}
                  styles={{ root: { height: "100%" } }}
                  iconProps={{ iconName: "Send" }}
                  onClick={send}
                />
              </Stack>
            </>
          )}
        </Stack>
      )}
    </>
  );
};
export default Conversation;
