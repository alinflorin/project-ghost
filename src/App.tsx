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
import { useEffect, useRef } from "react";
import useUserPreferences from "./hooks/useUserPreferences";
import useProfile from "./hooks/useProfile";

export const App = () => {
  const [t, i18n] = useTranslation();
  const initialPreferencesLoaded = useRef<boolean>(false);
  const [userPreferences, _, userPreferencesLoading] = useUserPreferences();

  const [profile, setProfile] = useProfile();

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
