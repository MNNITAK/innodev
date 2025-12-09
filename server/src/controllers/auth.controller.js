import AuthUser from "../models/authUser.model.js";
import { api_res } from "../utils/api_res.js";
import Api_err from "../utils/err.js";
import { async_handler } from "../utils/async_handler.js";
import {
  emailverificationTemplate,
  forgotPasswordTemplate,
  sendmail,
} from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const user = await AuthUser.findById(userid);
    const accesstoken = user.generateaccesstoken();
    const refreshtoken = user.generaterefreshtoken();
    user.refreshtokens = [...(user.refreshtokens || []), refreshtoken];
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new Api_err(
      "Internal Server Error access token generation failed",
      500
    );
  }
};
const registerUser = async_handler(async (req, res) => {
  const usernameLC = req.body.username?.trim().toLowerCase();
  const emailLC = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  const existingUser = await AuthUser.findOne({
    $or: [{ email: emailLC }, { username: usernameLC }],
  });
  if (existingUser) {
    throw new Api_err("User with given email or username already exists", 400);
  }
  const newUser = await AuthUser.create({
    username: usernameLC,
    email: emailLC,
    password,
    isemailverified: false,
  });
  const { unhashed, hashed, expiry } = newUser.generatetemporarytoken();
  newUser.emailverificationtokens = [hashed];
  newUser.emailverificationexpiry = expiry;
  await newUser.save({ validateBeforeSave: false });
  await sendmail({
    email: newUser.email,
    subject: "Email Verification",
    mailgencontent: emailverificationTemplate(
      newUser.username,
      `${req.protocol}://${req.get("host")}/api/auth/verify-email/${unhashed}`
    ),
  });
  const cuser = await AuthUser.findById(newUser._id).select(
    "-password -refreshtokens -forgotpasswordtokens -forgotpasswordexpiry -emailverificationtokens -emailverificationexpiry"
  );
  if (!cuser) {
    throw new Api_err("User not found", 404);
  }
  return res
    .status(201)
    .json(
      new api_res(
        201,
        { user: cuser },
        "User has been registered. Please verify your email."
      )
    );
});
const loginUser = async_handler(async (req, res) => {
  const emailLC = req.body.email?.trim().toLowerCase();
  const usernameLC = req.body.username?.trim().toLowerCase();
  const { password } = req.body;
  if (!emailLC && !usernameLC) {
    throw new Api_err("Please provide email or username", 400);
  }
  const user = await AuthUser.findOne({
    $or: [{ email: emailLC }, { username: usernameLC }],
  });
  if (!user) {
    throw new Api_err("Invalid email/username or password", 401);
  }
  const ispasswordvalid = await user.isPasswordCorrect(password);
  if (!ispasswordvalid) {
    throw new Api_err("Invalid email/username or password", 401);
  }
  const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
    user._id
  );
  const tokens = { accesstoken, refreshtoken };

  const loggedinuser = await AuthUser.findById(user._id).select(
    "-password -refreshtokens -forgotpasswordtokens -forgotpasswordexpiry -emailverificationtokens -emailverificationexpiry"
  );
  const OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("access_token", tokens.accesstoken, OPTIONS)
    .cookie("refresh_token", tokens.refreshtoken, OPTIONS)
    .json(
      new api_res(
        200,
        { user: loggedinuser, tokens },
        "User logged in successfully"
      )
    );
});

const logoutUser = async_handler(async (req, res) => {
  await AuthUser.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshtokens: [] },
    },
    {
      new: true,
    }
  );
  const OPTIONS = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("access_token", OPTIONS)
    .clearCookie("refresh_token", OPTIONS)
    .json(new api_res(200, null, "User logged out successfully"));
});

const getcurrentUser = async_handler(async (req, res) => {
  return res
    .status(200)
    .json(
      new api_res(200, { user: req.user }, "Current user fetched successfully")
    );
});

const verifyEmail = async_handler(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    throw new Api_err("Invalid or expired token", 400);
  }
  let hashedtoken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await AuthUser.findOne({
    emailverificationtokens: hashedtoken,
    emailverificationexpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new Api_err("Invalid or expired token", 400);
  }
  user.isemailverified = true;
  user.emailverificationtokens = [];
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new api_res(200, null, "Email verified successfully"));
});
const resendemailverification = async_handler(async (req, res) => {
  const user = await AuthUser.findById(req.user?._id);
  if (!user) {
    throw new Api_err("User not found", 404);
  }
  if (user.isemailverified) {
    throw new Api_err("Email is already verified", 400);
  }
  const { unhashed, hashed, expiry } = user.generatetemporarytoken();
  user.emailverificationtokens = [hashed];
  user.emailverificationexpiry = expiry;
  await user.save({ validateBeforeSave: false });
  await sendmail({
    email: user.email,
    subject: "Email Verification",
    mailgencontent: emailverificationTemplate(
      user.username,
      `${req.protocol}://${req.get("host")}/api/auth/verify-email/${unhashed}`
    ),
  });
  return res
    .status(200)
    .json(new api_res(200, null, "Email verification link sent"));
});
const refreshtaccesstoken = async_handler(async (req, res) => {
  const refreshToken = req.cookies?.refresh_token || req.body.refresh_token;
  if (!refreshToken) {
    throw new Api_err("No refresh token provided", 401);
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await AuthUser.findById(decoded?._id);
    if (!user) {
      throw new Api_err("User not found", 404);
    }
    if (!user.refreshtokens.includes(refreshToken)) {
      throw new Api_err("Invalid refresh token", 401);
    }
    const OPTIONS = {
      httpOnly: true,
      secure: true,
    };
    const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
      user._id
    );
    user.refreshtokens = [refreshtoken];
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie("access_token", accesstoken, OPTIONS)
      .cookie("refresh_token", refreshtoken, OPTIONS)
      .json(
        new api_res(
          200,
          { access_token: accesstoken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new Api_err("Invalid refresh token", 401);
  }
});
const forgetpasswordrequest = async_handler(async (req, res) => {
  const { email } = req.body;
  const emailLC = email?.trim().toLowerCase();
  const user = await AuthUser.findOne({ email: emailLC });
  if (!user) {
    throw new Api_err("User with given email does not exist", 404);
  }
  const { unhashed, hashed, expiry } = user.generatetemporarytoken();
  user.forgotpasswordtokens = [hashed];
  user.forgotpasswordexpiry = expiry;
  await user.save({ validateBeforeSave: false });
  await sendmail({
    email: user.email,
    subject: "Password Reset",
    mailgencontent: forgotPasswordTemplate(
      user.username,
      `${req.protocol}://${req.get("host")}/api/auth/reset-password/${unhashed}`
    ),
  });
  return res
    .status(200)
    .json(new api_res(200, null, "Password reset link sent"));
});
const resetforgetpassword = async_handler(async (req, res) => {
  const { resetToken } = req.params;
  const { newpassword } = req.body;
  if (!resetToken) {
    throw new Api_err("Invalid or expired token", 400);
  }
  let hashedtoken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await AuthUser.findOne({
    forgotpasswordtokens: hashedtoken,
    forgotpasswordexpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new Api_err("Invalid or expired token", 400);
  }
  user.password = newpassword;
  user.forgotpasswordtokens = [];
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new api_res(200, null, "Password reset successfully"));
});
const changecurrentuserpassword = async_handler(async (req, res) => {
  const { currentpassword, newpassword } = req.body;
  const user = await AuthUser.findById(req.user?._id);
  if (!user) {
    throw new Api_err("User not found", 404);
  }
  const ispasswordvalid = await user.isPasswordCorrect(currentpassword);
  if (!ispasswordvalid) {
    throw new Api_err("Current password is incorrect", 401);
  }
  user.password = newpassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new api_res(200, null, "Password changed successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  getcurrentUser,
  verifyEmail,
  resendemailverification,
  refreshtaccesstoken,
  forgetpasswordrequest as forgotPassword,
  resetforgetpassword as resetPassword,
  changecurrentuserpassword,
};
