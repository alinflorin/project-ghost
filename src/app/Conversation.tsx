import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardTitle,
  DocumentCardType,
  IDocumentCardActivityPerson,
  Stack,
} from "@fluentui/react";
import { useMemo } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { isOnline } from "../helpers/is-online";
import { Profile } from "../models/profile";
import { getDocumentRef } from "../services/firebase";

const getInitials = (n: string | null) => {
  if (n == null || n.length === 0) {
    return "U";
  }
  return n
    .split(" ")
    .map((x) => x[0].toUpperCase())
    .join("");
};

export const Conversation = () => {
  const params = useParams();
  const [t] = useTranslation();
  const [friendProfile, friendProfileLoading] = useDocumentData<Profile>(
    getDocumentRef(`profiles/${params.friendEmail}`)
  );

  const person: IDocumentCardActivityPerson | undefined = useMemo(() => {
    if (friendProfile == null) {
      return undefined;
    }
    return {
      name: friendProfile.displayName,
      profileImageSrc: friendProfile.photo,
      initials: getInitials(friendProfile.displayName!),
    } as IDocumentCardActivityPerson;
  }, [friendProfile]);

  return (
    <>
      {!friendProfileLoading && friendProfile && (
        <Stack horizontal={false} verticalFill={true}>
          <DocumentCardDetails>
            {person && (
              <DocumentCardActivity
                activity={
                  isOnline(friendProfile!.lastSeen)
                    ? t("ui.conversation.online")
                    : friendProfile!.lastSeen == null
                    ? t("ui.conversation.offline")
                    : t("ui.conversation.lastSeenAt") +
                      " " +
                      friendProfile!.lastSeen!.toDate().toLocaleString()
                }
                people={[person]}
              />
            )}
          </DocumentCardDetails>
        </Stack>
      )}
    </>
  );
};
export default Conversation;
