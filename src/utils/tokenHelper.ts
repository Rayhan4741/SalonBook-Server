import jwt, { Secret } from "jsonwebtoken";

export function signJwtToken(payload: object, secret: string, expiresIn: string = "7d"): string {
  return jwt.sign(payload, secret as Secret, { expiresIn: expiresIn as any });
}

export function decodeJwtToken(token: string): any {
  return jwt.decode(token);
}

