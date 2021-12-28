import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../services/firebase";

export const PrivateRoute = ({ children }: any) => {
  const [user] = useAuthState(firebaseAuth);
  const location = useLocation();
  const router = useNavigate();

  useEffect(() => {
    if (user === null) {
      router("/login?returnTo=" + encodeURIComponent(location.pathname));
    }
  }, [user]);
  return user ? children : <></>;
};

export default PrivateRoute;
