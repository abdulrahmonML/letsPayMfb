const Joi = require("joi");

// Define the rules
const registerSchema = Joi.object({
  name: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name should be at least 2 characters",
    }),
    lastName: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name should be at least 2 characters",
    }),
  }).required(), // Makes the entire name object mandatory
  phone: Joi.string()
    .custom((value, helpers) => {
      // Remove all non-numeric characters (dashes, spaces, etc.)
      const cleaned = value.replace(/\D/g, "");

      // Validate length after cleaning
      if (cleaned.length !== 11) {
        return helpers.message(
          "Phone number must be exactly 11 digits after removing dashes",
        );
      }
      return cleaned; // This returns the version WITHOUT dashes to your code
    })
    .trim()
    .required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).required(),
  dob: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .trim()
    .required()
    .messages({
      "string.pattern.base": "Date must follow the pattern YYYY-MM-DD",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
