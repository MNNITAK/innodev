import AuthUser from "../models/authUser.model.js";
import { api_res } from "../utils/api_res.js";
import Api_err from "../utils/err.js";
import { async_handler } from "../utils/async_handler.js";
import jwt from "jsonwebtoken";

export const verifyjwt = async_handler(async (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    req.header("authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Api_err("Unauthorized: No token provided", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const cuser = await AuthUser.findById(decoded?._id).select(
      "-password -refreshtokens -forgotpasswordtokens -forgotpasswordexpiry -emailverificationtokens -emailverificationexpiry"
    );
    if (!cuser) {
      throw new Api_err("INVALID TOKEN", 401);
    }
    req.user = cuser;
    next();
  } catch (error) {
    throw new Api_err("Unauthorized: Invalid token", 401);
  }
});
export default verifyjwt;
