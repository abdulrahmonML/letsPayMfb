// BVN GENERATION LOGIC
const crypto = require("crypto");
const nibssService = require("../services/nibssService");
// Generates a cryptographically secure 11-digit numeric string

const generateBvn = () => {
  // Min: 10,000,000,000
  // Max: 99,999,999,999 (exclusive, so we use 100,000,000,000)
  const min = 10000000000;
  const max = 100000000000;

  const number = crypto.randomInt(min, max);
  return number.toString();
};

const generateUniqueBvn = async (firstName, lastName, dob) => {
  const maxAttempts = 5;
  // generate bvn
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const bvn = generateBvn();

    // check database
    const existingBvn = await Bvn.findOne({ bvnNo: bvn });

    if (existingBvn) continue; // if bvn is taken, this goes on to the next iteration.

    try {
      const response = await nibssService.insertBvn(
        bvn,
        firstName,
        lastName,
        dob,
      );

      return response.bvn;
    } catch (error) {
      console.error(error.message);
      continue;
    }
  }

  throw new AppError("Failed to generate a unique BVN. Please try again", 500);
};

module.exports = generateUniqueBvn;
