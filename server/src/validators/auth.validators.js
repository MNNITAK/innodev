import { body, oneOf } from "express-validator";

const registerUserValidations = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
];
const userloginValidations = [
  oneOf(
    [
      body("email")
        .exists({ checkFalsy: true })
        .bail()
        .isEmail()
        .withMessage("Email must be a valid email address"),
      body("username")
        .exists({ checkFalsy: true })
        .bail()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    ],
    "Either a valid email or a username is required"
  ),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
const changecurrentuserpasswordValidations = [
  body("currentpassword")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newpassword").trim().notEmpty().withMessage("New password is required"),
];
const userforgotpasswordrequestValidations = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
];
const userresetforgotpasswordrequestValidations = [
  body("newpassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];
export {
  registerUserValidations,
  userloginValidations,
  changecurrentuserpasswordValidations,
  userforgotpasswordrequestValidations,
  userresetforgotpasswordrequestValidations,
};
