// CRITICAL: Suppress Chrome extension errors BEFORE anything else loads
// This must run first to catch errors during Auth0 redirects
(function() {
  'use strict';
  
  // Suppress Chrome runtime lastError
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(chrome.runtime, 'lastError');
      if (descriptor && descriptor.get) {
        Object.defineProperty(chrome.runtime, 'lastError', {
          get: function() {
            try {
              const error = descriptor.get.call(chrome.runtime);
              if (error && (
                error.message?.includes('message port') ||
                error.message?.includes('Extension context') ||
                error.message?.includes('Could not establish connection')
              )) {
                return undefined;
              }
              return error;
            } catch {
              return undefined;
            }
          },
          configurable: true,
          enumerable: false
        });
      }
    } catch (e) {
      // Ignore errors during setup
    }
  }

  // Suppress error events
  window.addEventListener('error', function(event) {
    const msg = event.message || event.error?.message || String(event.error || '');
    if (msg.includes('message port') || 
        msg.includes('lastError') ||
        msg.includes('Extension context') ||
        msg.includes('Could not establish connection')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  // Suppress unhandled rejections
  window.addEventListener('unhandledrejection', function(event) {
    const msg = event.reason?.message || String(event.reason || '');
    if (msg.includes('message port') || 
        msg.includes('lastError') ||
        msg.includes('Extension context') ||
        msg.includes('Could not establish connection')) {
      event.preventDefault();
      return false;
    }
  });
})();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./globals.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";

const domain = import.meta.env.VITE_INNODEV_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_INNODEV_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_INNODEV_AUTH0_AUDIENCE;

console.log("Auth0 Configuration:", {
  domain,
  clientId,
  audience,
  redirectUri: window.location.origin,
});

if (!domain || !clientId) {
  console.error("Missing Auth0 configuration. Please check your .env file.");
}

// Additional console filtering (backup to IIFE above)
const originalConsoleError = console.error;
console.error = function(...args) {
  const errorMessage = args.join(' ');
  if (errorMessage.includes('message port') || 
      errorMessage.includes('lastError') ||
      errorMessage.includes('Extension context') ||
      errorMessage.includes('Could not establish connection') ||
      errorMessage.includes('Unchecked runtime.lastError')) {
    // Silently ignore these errors
    return;
  }
  originalConsoleError.apply(console, args);
};

// Redirect callback - will be handled by App component via useNavigate
const onRedirectCallback = (appState) => {
  console.log("Auth0 redirect callback received:", appState);
  // The App component will handle navigation after Auth0 completes authentication
  // This prevents the "message port closed" error by not doing navigation here
};

if (!domain || !clientId) {
  console.error("❌ Missing Auth0 configuration!");
  console.error("Please create a .env file in the client/ directory with:");
  console.error("VITE_INNODEV_AUTH0_DOMAIN=your-domain.us.auth0.com");
  console.error("VITE_INNODEV_AUTH0_CLIENT_ID=your_client_id");
  console.error("VITE_INNODEV_AUTH0_AUDIENCE=your_audience");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={domain || ""}
        clientId={clientId || ""}
        authorizationParams={{
          redirect_uri: `${window.location.origin}/dashboard`,
          audience: audience,
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
        onRedirectCallback={onRedirectCallback}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>
);
