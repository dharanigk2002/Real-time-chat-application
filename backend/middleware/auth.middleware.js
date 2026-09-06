import { getToken } from "../utils/token.js";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

export async function authorize(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();
  if (!authHeader.startsWith("Bearer"))
    return res.status(400).json({
      success: false,
      error: "Authorization header must start with bearer",
    });
  try {
    const [_, token] = authHeader.split(" ");
    if (!token) throw new Error("Please login to continue");
    const decoded = getToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function isAuthenticated(req, res, next) {
  const userId = req.user?.id;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, error: "Please login to continue" });
  return next();
}
