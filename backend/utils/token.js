import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY ?? "$uperm@n";

export function generateToken(
  payload = {},
  secretKey = SECRET_KEY,
  expiresIn = "1d",
) {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
}

export function getToken(token, secretKey = SECRET_KEY) {
  const decoded = jwt.verify(token, secretKey);
  return decoded;
}
