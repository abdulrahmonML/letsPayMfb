const Joi = require("joi");

const transferSchema = Joi.object({
  /* from: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .trim()
    .required()
    .messages({
      "string.length": "Account number must be exactly 10 digits",
      "string.pattern.base": "Account number must only contain digits",
    }), */
  to: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "Account number must be exactly 10 digits",
      "string.pattern.base": "Account number must only contain digits",
    }),
  amount: Joi.number().trim().min(100).required().messages({
    "number.min": "Amount cannot be less than 100",
    "number.base": "Amount must be a valid number",
  }),
});

module.exports = transferSchema;
