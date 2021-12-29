import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const PrivateRoute = ({ children }: any) => {
  const [user, loading] = useAuth();
  const location = useLocation();
  const router = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user === null) {
      router("/login?returnTo=" + encodeURIComponent(location.pathname));
    }
  }, [user, loading]);
  return user ? children : <></>;
};

export default PrivateRoute;
