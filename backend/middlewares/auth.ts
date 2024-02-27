import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string | undefined;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["token"];
  if (!token) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("decoded", decoded);
    req.userId = (decoded as JwtPayload).id;
    next();
  } catch (error) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
};

export default verifyToken;
