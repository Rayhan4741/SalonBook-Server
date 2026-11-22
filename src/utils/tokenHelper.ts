import jwt from "jsonwebtoken";

export function signJwtToken(payload: object, secret: string, expiresIn: string = "7d"): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function decodeJwtToken(token: string): any {
  return jwt.decode(token);
}
