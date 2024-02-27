import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, { message: string }>;
  path?: string;
}

const errorMiddleware = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.log("Error in errorMiddleware:", err);

  //   if (process.env.NODE_ENV === "development") {
  //     res.status(err.statusCode).json({
  //       success: false,
  //       error: err,
  //       message: err.message,
  //       stack: err.stack,
  //     });
  //   } else if (process.env.NODE_ENV === "production") {
  let error: ErrorWithStatusCode = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors!).map((value) => value.message);
    error = new ErrorHandler(message.join(", "), 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue!)} error`;
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again!";
    error = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired";
    error = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
  //   }
};

export default errorMiddleware;
