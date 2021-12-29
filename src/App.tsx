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
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useRef } from "react";
import useUserPreferences from "./hooks/useUserPreferences";
import useProfile from "./hooks/useProfile";
import { useInterval } from "./hooks/useInterval";
import { environment } from "./environment";
import { useAuth } from "./hooks/useAuth";
import { serverTimestamp } from "firebase/firestore";
import Settings from "./app/Settings";

export const App = () => {
  const [t, i18n] = useTranslation();
  const initialPreferencesLoaded = useRef<boolean>(false);
  const [userPreferences, _, userPreferencesLoading] = useUserPreferences();
  const [user, userLoading] = useAuth();

  const [__, setProfile] = useProfile(true);

  const heartbeat = useCallback(async () => {
    if (userLoading || userPreferencesLoading || user == null) {
      return false;
    }
    await setProfile({
      displayName: user.displayName || undefined,
      email: user.email || undefined,
      lastSeen: userPreferences?.disableLastSeen
        ? null
        : (serverTimestamp() as any),
      photo: user.photoURL || undefined,
    });
    return true;
  }, [setProfile, userPreferences, userPreferencesLoading, user, userLoading]);

  useEffect(() => {
    (async () => {
      await heartbeat();
    })();
  }, [heartbeat]);

  useInterval(() => {
    (async () => {
      await heartbeat();
    })();
  }, environment.heartbeat);

  useEffect(() => {
    if (initialPreferencesLoaded.current || userPreferencesLoading) {
      return;
    }
    if (userPreferences?.language != null) {
      (async () => {
        await i18n.changeLanguage(userPreferences!.language!);
      })();
    }
  }, [userPreferences, initialPreferencesLoaded, i18n, userPreferencesLoading]);

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
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
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
