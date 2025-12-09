import { Router } from "express";
import { checkJwt } from "../middleware/middleware.js";
import { syncUser } from "../controllers/user.controller.js";

const router = Router();

// This route will be called by frontend AFTER login in Auth0
router.get("/me", (req, res, next) => {
  console.log("🔥 /api/users/me hit");
  next(); // pass control to checkJwt
}, checkJwt, syncUser);


export default router;
