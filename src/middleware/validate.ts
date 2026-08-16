import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import AppError from "../utils/appError";

type ValidationSource = "body" | "query";

const validate = (schema: ObjectSchema, source: ValidationSource = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = source === "query" ? req.query : req.body;

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return next(new AppError(errorMessage, 400));
    }

    if (source === "query") {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

export default validate;
