import {
  BaseButton,
  Button,
  ITextStyles,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";
import React, { useCallback } from "react";

import useResponsive from "../../hooks/useResponsive";
import useSubjectState from "../../hooks/useSubjectState";
import { ToastMessage } from "./toast-message";
import { remove } from "./toast-service";
import { ToastSeverity } from "./toast-severity";
import ToastStore from "./toast-store";

const getMessageBarType = (severity: ToastSeverity): MessageBarType => {
  switch (severity) {
    default:
    case ToastSeverity.Info:
      return MessageBarType.info;
    case ToastSeverity.Warn:
      return MessageBarType.severeWarning;
    case ToastSeverity.Success:
      return MessageBarType.success;
    case ToastSeverity.Error:
      return MessageBarType.error;
  }
};

const textStyles: Partial<ITextStyles> = {
  root: {
    color: "black !important",
  },
};

export const ToastZone = () => {
  const [state] = useSubjectState(ToastStore);
  const { isMobile } = useResponsive();

  const onDismissClick = useCallback(
    async (
      e:
        | React.MouseEvent<HTMLElement | BaseButton | Button, MouseEvent>
        | undefined,
      m: ToastMessage
    ) => {
      e?.preventDefault();
      e?.stopPropagation();
      if (m.onClick != null) {
        await m.onClick();
      }
      remove(m);
    },
    []
  );

  const onToastClick = useCallback(async (m: ToastMessage) => {
    if (m.onClick != null) {
      await m.onClick();
    }
    remove(m);
  }, []);

  return (
    <div
      id="toast-zone"
      style={{
        position: "absolute",
        maxWidth: isMobile ? "100%" : "50%",
        right: "0",
        top: "0",
        zIndex: 10000000,
        overflow: "hidden",
        maxHeight: "calc(100% - 2rem)",
        padding:
          state.messages == null || state.messages.length === 0 ? "0" : "1rem",
      }}
    >
      {state.messages.map((m, i) => (
        <MessageBar
          messageBarType={getMessageBarType(m.severity)}
          onDismiss={(e) => onDismissClick(e, m)}
          onClick={() => onToastClick(m)}
          key={i}
          styles={{
            root: {
              marginBottom: "1rem",
              cursor: "pointer",
              minHeight: "initial",
              zIndex: 10000000,
            },
          }}
        >
          {m.title && (
            <Text block variant="large" styles={textStyles}>
              {m.title}
            </Text>
          )}
          <Text block variant="small" styles={textStyles}>
            {m.message}
          </Text>
        </MessageBar>
      ))}
    </div>
  );
};
export default ToastZone;
