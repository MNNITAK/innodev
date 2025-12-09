// auth0Middleware.js
import { auth } from "express-oauth2-jwt-bearer";

const audience = process.env.AUTH0_AUDIENCE || "https://Codomon.com/api";
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL || "https://dev-eqdjur8rssmalaln.us.auth0.com/";

if (!audience || !issuerBaseURL) {
  console.warn("⚠️ Auth0 environment variables not set. Using defaults.");
}

export const checkJwt = auth({
  audience: audience,
  issuerBaseURL: issuerBaseURL,
});

console.log("Auth0 Middleware configured with audience =>", audience);