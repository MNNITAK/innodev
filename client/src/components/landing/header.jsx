import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  const handleLogin = async () => {
    try {
      console.log("Attempting login...");
      await loginWithRedirect({
        appState: {
          returnTo: "/dashboard",
        },
        // REMOVED: authorizationParams override. 
        // It will now use the correct URI from main.jsx
      });
    } catch (error) {
      if (error?.message?.includes('message port') || 
          error?.message?.includes('lastError') ||
          error?.message?.includes('Extension context')) {
        return;
      }
      console.error("❌ Login error:", error);
    }
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-6 left-1/2 z-50 -translate-x-1/2 w-full max-w-5xl px-6">
      <nav className="flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-[oklch(0.18_0_0)]/90 backdrop-blur-md px-6 shadow-lg shadow-black/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
              <circle cx="16" cy="8" r="2" stroke="currentColor" fill="none" opacity="0.7" />
              <circle cx="8" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
              <circle cx="16" cy="16" r="2" stroke="currentColor" fill="none" opacity="0.7" />
              <path d="M10 10 L12 12 M14 10 L12 12 M10 14 L12 12 M14 14 L12 12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
          <span className="text-sm font-medium tracking-[0.2em] uppercase text-white">
            CIVORA
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {['features', 'how-it-works', 'technology'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1 capitalize"
            >
              {section.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        {!isAuthenticated ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
            onClick={handleLogin}
          >
            Log In
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        )}
      </nav>
    </header>
  );
}