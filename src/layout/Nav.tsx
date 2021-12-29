import {
  INavLink,
  INavLinkGroup,
  INavStyles,
  IPanel,
  Nav as FluentNav,
  useTheme,
} from "@fluentui/react";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

interface NavProps {
  hasBorder?: boolean;
  panelRef?: IPanel;
}

export const Nav = (props: NavProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useNavigate();
  const location = useLocation();

  const navStyles: Partial<INavStyles> = useMemo(
    () => ({
      root: {
        overflow: "auto",
        height: "100%",
        minWidth: "200px",
        borderRight: props.hasBorder
          ? `solid 1px ${theme.palette.neutralLighter}`
          : `none`,
      },
      groupContent: {
        marginBottom: 0,
      },
    }),
    [props.hasBorder, theme]
  );

  const navLinkGroups: INavLinkGroup[] = useMemo(() => {
    const items: INavLinkGroup[] = [
      {
        links: [
          {
            name: t("ui.nav.dashboard"),
            url: "/dashboard",
            key: "/dashboard",
            forceAnchor: true,
            icon: "ViewDashboard",
          },
          {
            name: t("ui.nav.settings"),
            url: "/settings",
            key: "/settings",
            forceAnchor: true,
            icon: "Settings",
          },
        ],
      },
    ];

    return items;
  }, [t]);

  const linkClick = useCallback(
    (
      e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
      link: INavLink | undefined
    ) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (link?.url != null && link?.url !== "#") {
        router(link.url);
      }
      if (props.panelRef != null) {
        props.panelRef.dismiss();
      }
    },
    [router, props.panelRef]
  );

  return (
    <FluentNav
      styles={navStyles}
      groups={navLinkGroups}
      onLinkClick={linkClick}
      selectedKey={location.pathname}
      initialSelectedKey="/dashboard"
    />
  );
};

export default Nav;
