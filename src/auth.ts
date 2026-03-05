import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type JwtPayload = { userId: string; email: string; role: string };

export function authRequired(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) {
  try {
    const token =
      (req as any).cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token)
      return res.status(401).json({ ok: false, message: "Unauthorized." });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev_secret",
    ) as JwtPayload;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token." });
  }
}
