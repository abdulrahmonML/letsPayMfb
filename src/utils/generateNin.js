// BVN GENERATION LOGIC
const crypto = require("crypto");
const nibssService = require("../services/nibssService");
const Nin = require("../models/nin");
const AppError = require("./appError");
// Generates a cryptographically secure 11-digit numeric string

const generateNin = () => {
  // Min: 10,000,000,000
  // Max: 99,999,999,999 (exclusive, so we use 100,000,000,000)
  const min = 10000000000;
  const max = 100000000000;

  const number = crypto.randomInt(min, max);
  return number.toString();
};

const generateUniqueNin = async (firstName, lastName, dob) => {
  const maxAttempts = 5;
  // generate nin
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const nin = generateNin();

    // check database
    const existingNin = await Nin.findOne({ ninNo: nin });

    if (existingNin) continue; // if bvn is taken, this goes on to the next iteration.

    try {
      const response = await nibssService.insertNin(
        nin,
        firstName,
        lastName,
        dob,
      );

      return response.response.nin;
    } catch (error) {
      console.error(
        `NIBSS call failed on attempt ${attempt}:`,
        error.response?.data || error.message,
      );
      continue;
    }
  }

  throw new AppError("Failed to generate a unique NIN. Please try again", 500);
};

module.exports = generateUniqueNin;
