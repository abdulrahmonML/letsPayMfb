// TOKEN MANAGEMENT

const axios = require("axios");
require("dotenv").config();
const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;

let nibssToken = null;
let tokenExpiry = null;

const getNibssToken = async () => {
  // check if token exists and hasn't expired
  if (nibssToken && tokenExpiry && Date.now() < tokenExpiry) {
    return nibssToken;
  }

  try {
    // token missing or expired — fetch a fresh one

    const response = await axios.post(`${NIBSS_BASE_URL}/api/auth/token`, {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET,
    });

    nibssToken = response.data.token;
    tokenExpiry = Date.now() + 55 * 60 * 1000; // 55 mins (before 1hr expiry)

    return nibssToken;
  } catch (error) {
    console.error("NIBSS token fetch failed:", error.message);
    throw new Error(`NIBSS authentication failed: ${error.message}`);
  }
};

module.exports = getNibssToken;
