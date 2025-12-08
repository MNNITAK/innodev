import { validationResult } from "express-validator";
import Api_err from "../utils/err.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return next(new Api_err("Validation failed", 422, extractedErrors));
};
