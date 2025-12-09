// controllers/user.controller.js
import User from "../models/userModel.js";

export const syncUser = async (req, res) => {
  try {
    console.log("🚀 syncUser called");
    console.log("req.auth:", req.auth);

    // express-oauth2-jwt-bearer gives you { payload, header, token }
    const payload = req.auth?.payload;

    if (!payload) {
      console.log("❌ No payload on req.auth");
      return res.status(400).json({ message: "No auth payload from Auth0" });
    }

    const auth0Id = payload.sub;      // ✅ now this will be "google-oauth2|..."

    console.log("Parsed from token:", { auth0Id });

    if (!auth0Id) {
      console.log("❌ No sub in token payload");
      return res.status(400).json({ message: "No sub (auth0Id) in token" });
    }

    let user = await User.findOne({ auth0Id });

    if (!user) {
      console.log("🧱 Creating new user:", auth0Id);
      user = await User.create({
        auth0Id,
      });
    } else {
      console.log("✅ Found existing user:", user._id);
    }

    return res.json(user);
  } catch (err) {
    console.error("❌ Error in syncUser:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
