import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const authUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: {
        url: String,
        localpath: String,
      },
      default: {
        url: "",
        localpath: "",
      },
    },
    isemailverified: { type: Boolean, default: false },
    refreshtokens: [{ type: String }],
    forgotpasswordtokens: [{ type: String }],
    forgotpasswordexpiry: { type: Date },
    emailverificationtokens: [{ type: String }],
    emailverificationexpiry: { type: Date },
  },
  { timestamps: true }
);

authUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

authUserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

authUserSchema.methods.generateaccesstoken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

authUserSchema.methods.generaterefreshtoken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

authUserSchema.methods.generatetemporarytoken = function () {
  const unhashed = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(unhashed).digest("hex");
  const expiry = Date.now() + 10 * 60 * 1000;
  return { unhashed, hashed, expiry };
};

export const AuthUser = mongoose.model("AuthUser", authUserSchema);
export default AuthUser;
