import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  verifyEmail,
  refreshtaccesstoken,
  forgotPassword,
  resetPassword,
  getcurrentUser,
  changecurrentuserpassword,
  resendemailverification,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validators.middleware.js";
import {
  registerUserValidations,
  userloginValidations,
  userforgotpasswordrequestValidations,
  userresetforgotpasswordrequestValidations,
  changecurrentuserpasswordValidations,
} from "../validators/auth.validators.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const router = Router();
//unsecured routes
router.route("/register").post(registerUserValidations, validate, registerUser);
router.route("/login").post(userloginValidations, validate, loginUser);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/refresh-token").post(refreshtaccesstoken);
router
  .route("/forgot-password")
  .post(userforgotpasswordrequestValidations, validate, forgotPassword);
router
  .route("/reset-password/:resetToken")
  .post(userresetforgotpasswordrequestValidations, validate, resetPassword);

//secure routes
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/current-user").get(verifyjwt, getcurrentUser);
router
  .route("/change-password")
  .post(
    verifyjwt,
    changecurrentuserpasswordValidations,
    validate,
    changecurrentuserpassword
  );
router
  .route("/resend-verification-email")
  .post(verifyjwt, resendemailverification);

export default router;
