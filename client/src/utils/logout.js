// utils/logout.js
import { useAuth0 } from "@auth0/auth0-react";

export function useLogout() {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // ✅ Clear sessionStorage ONLY when user actually logs out
    window.sessionStorage.clear();

    logout({
      logoutParams: {
        returnTo: window.location.origin + "/",
      },
    });
  };

  return handleLogout;
}
