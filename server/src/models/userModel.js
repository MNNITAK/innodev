// models/userModel.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String },
    name: { type: String },
    picture: { type: String },
    // add any extra fields you want: role, phone, etc.
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
