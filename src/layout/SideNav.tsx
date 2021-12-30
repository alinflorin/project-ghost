import { IPanel, Panel, PanelType, Stack } from "@fluentui/react";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import useResponsive from "../hooks/useResponsive";
import useSubjectState from "../hooks/useSubjectState";
import HeaderStore from "./header-store";

import Nav from "./Nav";

export const SideNav = () => {
  const [user, loading] = useAuth();
  const { isMobile } = useResponsive();
  const [headerState, setHeaderState] = useSubjectState(HeaderStore);
  const [t] = useTranslation();

  const dismissPanel = useCallback(() => {
    setHeaderState({
      ...headerState,
      isNavOpen: false,
    });
  }, [headerState, setHeaderState]);

  const panelRef = useRef<IPanel | undefined>(undefined);

  return (
    <>
      {!loading && user && (
        <Stack grow={true} verticalFill={true} className="side-nav-wrapper">
          {isMobile && (
            <Panel
              componentRef={(r) => {
                (panelRef.current as any) = r;
              }}
              isLightDismiss
              isBlocking={true}
              isFooterAtBottom={true}
              isOpen={headerState.isNavOpen}
              type={PanelType.customNear}
              customWidth={"auto"}
              hasCloseButton={true}
              styles={{
                content: {
                  padding: "0",
                },
              }}
              onDismiss={dismissPanel}
              headerText={t("ui.sidenav.menu")}
            >
              <Nav panelRef={panelRef.current} hasBorder={false} />
            </Panel>
          )}
          {!isMobile && <Nav hasBorder={true} />}
        </Stack>
      )}
    </>
  );
};
export default SideNav;
