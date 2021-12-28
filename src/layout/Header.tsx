import {
  CommandBar,
  ContextualMenuItemType,
  FontIcon,
  ICommandBarItemProps,
  Toggle,
  useTheme,
} from "@fluentui/react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { environment } from "../environment";

import useResponsive from "../hooks/useResponsive";
import useSubjectState from "../hooks/useSubjectState";
import HeaderStore from "./header-store";

export const Header = () => {
  const { isMobile } = useResponsive();
  const [headerState, setHeaderState] = useSubjectState(HeaderStore);
  const router = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const logoutClick = useCallback(async () => {}, []);

  const user = null;

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
                marginRight: "1rem",
              }}
            />
          </Link>
        ),
      },
    ];
    if (user == null) {
      _items.push({
        key: "home",
        text: t("ui.header.home"),
        iconProps: { iconName: "HomeSolid" },
        onClick: () => router("/"),
        canCheck: true,
        checked: location.pathname === "/",
      });
    } else {
      _items.push({
        key: "dashboard",
        text: t("ui.header.dashboard"),
        iconProps: { iconName: "ViewDashboard" },
        onClick: () => router("/dashboard"),
        canCheck: true,
        checked: location.pathname === "/dashboard",
      });
    }
    return isMobile
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
      })();
    },
    [i18n]
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
    } else {
      // TODO
    }

    const ddMenu: ICommandBarItemProps = {
      key: "more",
      iconOnly: true,
      iconProps: { iconName: "MoreVertical" },
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
    theme,
  ]);

  return (
    <CommandBar
      style={{ height: "50px" }}
      styles={{ root: { height: "50px", paddingLeft: "0", paddingRight: "0" } }}
      items={items}
      farItems={_farItems}
    />
  );
};
export default Header;
