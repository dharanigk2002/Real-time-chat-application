import bcrypt from "bcrypt";
import User from "../db/schema/user.schema.js";
import {
  loginRequestBodySchema,
  signupRequestBodySchema,
} from "../schema/index.js";
import { validateSchema } from "../utils/validation.js";
import { generateToken } from "../utils/token.js";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function signup(req, res) {
  try {
    const data = await validateSchema(signupRequestBodySchema, req.body);
    const { firstName, lastName, email, password } = data;
    const existingUser = await User.findByEmail(email);
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, error: "Email id has already been taken" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      userId: user._id,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const formattedErrors = {};

      Object.keys(error.errors).forEach((key) => {
        formattedErrors[key] = err.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function login(req, res) {
  try {
    const { email, password } = await validateSchema(
      loginRequestBodySchema,
      req.body,
    );
    const user = await User.findByEmail(email);
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "User does not exists" });
    const isPasswordMatching = await bcrypt.compare(password, user?.password);
    if (!isPasswordMatching)
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    const token = generateToken({ id: user._id });
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong on the server" });
  }
}
