import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const message = error.message || "Internal Server Error";

  // Don't expose internal error details for unexpected errors
  if (!isAppError) {
    console.error("UNEXPECTED ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    return;
  }

  console.error(error);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
