import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import LandingPage from "./pages/Landing";

// Dashboard Components
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Analytics from "./pages/dashboard/Analytics";
import History from "./pages/dashboard/History";
import MapView from "./pages/dashboard/MapView";
import Population from "./pages/dashboard/Population";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

function App() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      console.error("Auth0 Error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthCode = urlParams.has("code");
      const hasState = urlParams.has("state");
      
      if (window.location.pathname === "/" || window.location.pathname === "" || hasAuthCode || hasState) {
        if (hasAuthCode || hasState) {
          setTimeout(() => {
            window.history.replaceState({}, document.title, "/dashboard");
            navigate("/dashboard", { replace: true });
          }, 100);
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
              <div className="text-center">
                <p>Please log in to access the dashboard</p>
              </div>
            </div>
          )
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="history" element={<History />} />
        <Route path="map" element={<MapView />} />
        <Route path="population" element={<Population />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;