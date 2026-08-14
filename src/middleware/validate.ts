const AppError = require("../utils/appError");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = source === "query" ? req.query : req.body;

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      return next(new AppError(errorMessage, 400)); // not throw
    }

    // Replace the source with the clean validated data
    if (source === "query") {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

module.exports = validate;
