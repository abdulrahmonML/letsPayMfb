import crypto from "crypto";
import * as nibssService from "../services/nibssService";
import Nin from "../models/nin";
import AppError from "./appError";

const generateNin = (): string => {
  const min = 10000000000;
  const max = 100000000000;
  const number = crypto.randomInt(min, max);
  return number.toString();
};

const generateUniqueNin = async (
  firstName: string,
  lastName: string,
  dob: string,
): Promise<string> => {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const nin = generateNin();

    const existingNin = await Nin.findOne({ ninNo: nin });
    if (existingNin) continue;

    try {
      const response = await nibssService.insertNin(
        nin,
        firstName,
        lastName,
        dob,
      );
      return response.response.nin;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `NIBSS call failed on attempt ${attempt}:`,
          error.message,
        );
      }
      continue;
    }
  }

  throw new AppError("Failed to generate a unique NIN. Please try again", 500);
};

export default generateUniqueNin;
