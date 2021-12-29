import {
  CommandBar,
  ContextualMenuItemType,
  ICommandBarItemProps,
  Persona,
  PersonaPresence,
  PersonaSize,
} from "@fluentui/react";
import { MoreVerticalIcon } from "@fluentui/react-icons-mdl2";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { environment } from "../environment";
import { useAuth } from "../hooks/useAuth";

import useResponsive from "../hooks/useResponsive";
import useSubjectState from "../hooks/useSubjectState";
import useUserPreferences from "../hooks/useUserPreferences";
import { logout } from "../services/firebase";
import HeaderStore from "./header-store";

const getInitials = (n: string | null) => {
  if (n == null || n.length === 0) {
    return "U";
  }
  return n
    .split(" ")
    .map((x) => x[0].toUpperCase())
    .join("");
};

export const Header = () => {
  const { isMobile } = useResponsive();
  const [headerState, setHeaderState] = useSubjectState(HeaderStore);
  const router = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [user] = useAuth();
  const [_, setUserPreferences] = useUserPreferences();

  const logoutClick = useCallback(async () => {
    await logout();
    router("/login");
  }, [router]);

  const items: ICommandBarItemProps[] = useMemo(() => {
    const _items: ICommandBarItemProps[] = [
      {
        key: "logo",
        onRender: () => (
          <Link to="/">
            <img
              src="/images/logo.svg"
              alt="Logo"
              style={{
                height: "100%",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            />
          </Link>
        ),
      },
      {
        key: "home",
        text: t("ui.header.home"),
        iconProps: { iconName: "HomeSolid" },
        onClick: () => router("/"),
        canCheck: true,
        checked: location.pathname === "/",
      },
    ];

    return isMobile && user != null
      ? [
          {
            key: "menuicon",
            iconOnly: true,
            iconProps: { iconName: "GlobalNavButton" },
            onClick: () => {
              setHeaderState({
                isNavOpen: !headerState.isNavOpen,
              });
            },
          },
          ..._items,
        ]
      : _items;
  }, [
    user,
    isMobile,
    t,
    location.pathname,
    router,
    setHeaderState,
    headerState.isNavOpen,
  ]);

  const changeLanguage = useCallback(
    (langCode: string) => {
      (async () => {
        await i18n.changeLanguage(langCode);
        await setUserPreferences({
          language: langCode,
        });
      })();
    },
    [i18n, setUserPreferences]
  );

  const _farItems: ICommandBarItemProps[] = useMemo(() => {
    const items: ICommandBarItemProps[] = [];

    if (user == null) {
      items.push({
        key: "login",
        text: t("ui.header.login"),
        iconOnly: false,
        iconProps: { iconName: "AuthenticatorApp" },
        onClick: () => router("/login"),
        canCheck: true,
        checked: location.pathname === "/login",
      });
    }

    const ddMenu: ICommandBarItemProps = {
      key: "more",
      iconOnly: true,
      onRenderIcon: () => (
        <>
          {user == null && <MoreVerticalIcon />}{" "}
          {user != null && (
            <Persona
              imageUrl={user.photoURL || undefined}
              imageInitials={getInitials(user!.displayName)}
              text={user.displayName || undefined}
              size={PersonaSize.size40}
              presence={PersonaPresence.online}
              hidePersonaDetails={true}
            />
          )}
        </>
      ),
      buttonStyles: {
        menuIcon: {
          display: "none",
        },
      },
      subMenuProps: {
        isSubMenu: true,
        key: "more_list",
        items: [
          {
            key: "lang_list",
            text: t("ui.header.language"),
            iconProps: { iconName: "LocaleLanguage" },
            subMenuProps: {
              items: environment.availableLanguages.map((x) => ({
                key: "lang_" + x.code,
                text: x.name,
                canCheck: true,
                checked: i18n.language === x.code,
                onClick: () => changeLanguage(x.code),
              })),
            },
          },
        ],
      },
    };

    if (user != null) {
      ddMenu.subMenuProps!.items = [
        {
          key: "user_id",
          text: user.displayName!,
          iconProps: { iconName: "UserOptional" },
          disabled: false,
          itemType: ContextualMenuItemType.Header,
        },
        ...ddMenu.subMenuProps!.items,
      ];

      ddMenu.subMenuProps!.items = [
        ...ddMenu.subMenuProps!.items,
        {
          key: "logout",
          text: t("ui.header.logout"),
          iconProps: { iconName: "FollowUser" },
          onClick: () => {
            logoutClick();
          },
        },
      ];
    }

    items.push(ddMenu);
    return items;
  }, [
    user,
    t,
    location.pathname,
    router,
    i18n.language,
    changeLanguage,
    logoutClick,
  ]);

  return (
    <>
      {i18n.isInitialized && (
        <CommandBar
          styles={{
            root: { paddingLeft: "0", paddingRight: "0" },
          }}
          items={items}
          farItems={_farItems}
        />
      )}
    </>
  );
};
export default Header;
