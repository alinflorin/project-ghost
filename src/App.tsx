import { Separator, Stack, ThemeProvider } from "@fluentui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./app/Dashboard";
import ForgotPassword from "./app/ForgotPassword";
import Home from "./app/Home";
import Login from "./app/Login";
import Signup from "./app/Signup";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import SideNav from "./layout/SideNav";
import ToastZone from "./shared/toast/ToastZone";
import theme from "./theme";
import PrivateRoute from "./helpers/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useRef } from "react";
import { getUserPreferences } from "./services/user-preferences";
import { useTranslation } from "react-i18next";
import { useInterval } from "./hooks/useInterval";
import { updateProfile, updateProfileLastSeen } from "./services/profile";
import { serverTimestamp } from "firebase/firestore";
import { environment } from "./environment";

export const App = () => {
  const [user, userLoading] = useAuth();
  const preferencesApplied = useRef(false);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    if (preferencesApplied.current) {
      return;
    }
    if (userLoading) {
      return;
    }
    if (user == null) {
      return;
    }
    (async () => {
      const up = await getUserPreferences(user.email!);
      if (up != null && up.language != null && up.language !== i18n.language) {
        await i18n.changeLanguage(up.language);
      }
    })();
    preferencesApplied.current = true;
  }, [preferencesApplied, user, userLoading, i18n]);

  const sentInitialUpdate = useRef<boolean>(false);

  useEffect(() => {
    if (user == null || userLoading || sentInitialUpdate.current) {
      return;
    }
    sentInitialUpdate.current = true;
    (async () => {
      await updateProfile(user.email!, {
        displayName: user.displayName,
        email: user.email,
        lastSeen: serverTimestamp(),
        photo: user.photoURL,
      } as any);
    })();
  }, [user, userLoading, sentInitialUpdate]);

  useInterval(() => {
    if (userLoading || user == null) {
      return;
    }
    (async () => {
      await updateProfileLastSeen(user.email!);
    })();
  }, environment.heartbeat);

  return (
    <ThemeProvider applyTo="body" theme={theme} style={{ height: "100%" }}>
      <BrowserRouter>
        <Stack verticalFill={true} grow={true}>
          <Stack as={Header} />
          <Separator
            styles={{ root: { padding: "0", fontSize: "2px" } }}
          ></Separator>
          <Stack
            verticalFill={true}
            grow={true}
            horizontal={true}
            styles={{ root: { width: "100%", height: "100%", minHeight: "0" } }}
          >
            <Stack>
              <SideNav />
            </Stack>

            <Stack
              verticalFill={true}
              grow={true}
              horizontal={true}
              styles={{ root: { padding: "1rem" } }}
            >
              <Stack
                grow={true}
                verticalFill={true}
                styles={{ root: { height: "100%", overflow: "auto" } }}
              >
                <Routes>
                  <Route index element={<Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
              </Stack>
            </Stack>
          </Stack>
          <Stack as={Footer} />

          <ToastZone />
        </Stack>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
