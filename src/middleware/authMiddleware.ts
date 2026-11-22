import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { User, IUser } from "../models/User";
import { auth } from "../auth/betterAuth";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  phone?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let userId: string | null = null;
    let userEmail: string | null = null;

    // 1. Try Better Auth Session first via request headers/cookies
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (session && session.user) {
        userId = session.user.id;
        userEmail = session.user.email;
      }
    } catch (sessionErr) {
      // Better auth session check failed, fall through to JWT header verification
    }

    // 2. If no session, extract from Authorization Bearer token
    if (!userId && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, config.betterAuthSecret) as any;
          userId = decoded.sub || decoded.id || decoded.userId;
          userEmail = decoded.email;
        } catch (jwtErr: any) {
          res.status(401).json({
            success: false,
            message: "Authentication token is invalid or expired. Please sign in again.",
          });
          return;
        }
      }
    }

    if (!userId && !userEmail) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please sign in to access this resource.",
      });
      return;
    }

    // 3. Always fetch fresh user state from server database (source of truth for role & isBlocked)
    const dbUser = await User.findOne(
      userId ? { $or: [{ _id: userId.match(/^[0-9a-fA-F]{24}$/) ? userId : null }, { id: userId }, { email: userEmail }] } : { email: userEmail }
    );

    if (!dbUser) {
      res.status(401).json({
        success: false,
        message: "User account not found. Authentication revoked.",
      });
      return;
    }

    // 4. Blocked check
    if (dbUser.isBlocked) {
      res.status(403).json({
        success: false,
        message: "Your account has been blocked by an administrator. Please contact support.",
      });
      return;
    }

    // Attach verified user to request
    req.user = {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
      role: dbUser.role,
      isBlocked: dbUser.isBlocked,
      phone: dbUser.phone,
    };

    next();
  } catch (error: any) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Internal authentication verification failure",
    });
  }
};

export const checkBlockedUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.isBlocked) {
    res.status(403).json({
      success: false,
      message: "Account is blocked. Action not permitted.",
    });
    return;
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Administrator privileges required.",
    });
    return;
  }

  next();
};

export const requireCustomer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  if (req.user.role !== "customer") {
    res.status(403).json({
      success: false,
      message: "Forbidden: Customer account required. Administrators cannot book appointments as customers.",
    });
    return;
  }

  next();
};
