import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;

let nibssToken: string | null = null;
let tokenExpiry: number | null = null;

const getNibssToken = async (): Promise<string> => {
  if (nibssToken && tokenExpiry && Date.now() < tokenExpiry) {
    return nibssToken;
  }

  try {
    const response = await axios.post(`${NIBSS_BASE_URL}/api/auth/token`, {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET,
    });

    nibssToken = response.data.token;
    tokenExpiry = Date.now() + 55 * 60 * 1000;

    return nibssToken as string;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("NIBSS token fetch failed:", error.message);
      throw new Error(`NIBSS authentication failed: ${error.message}`);
    }
    throw new Error("NIBSS authentication failed: Unknown error");
  }
};

export default getNibssToken;
