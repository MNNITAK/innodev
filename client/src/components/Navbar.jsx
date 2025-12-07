import LoginButton from "./LoginButton";
import { Earth } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth0();
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-center pt-4 px-4">
      <nav
        className="
          w-full max-w-5xl
          flex items-center justify-between
          px-8 py-4
          rounded-full
          border border-white/12
          bg-black/70
          backdrop-blur-lg
          shadow-[0_0_40px_rgba(0,0,0,0.65)]
        "
      >
        {/* Left: Icon + Name */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
            <Earth size={18} strokeWidth={1.5} className="text-white/90" />
          </div>
          <span className="hidden sm:inline text-xs tracking-[0.28em] uppercase text-white/55">
            Civora
          </span>
        </div>

        {/* Right: Login/Logout */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="px-5 py-3 rounded-full text-sm font-medium text-white/85 border border-white/15 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:text-white shadow-[0_0_8px_rgba(255,255,255,0.04)]"
            >
              Log Out
            </button>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
