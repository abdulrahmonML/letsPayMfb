// scripts/onboard.js — run once with: node scripts/onboard.js
const axios = require("axios");
require("dotenv").config();

const onboard = async () => {
  const response = await axios.post(
    `${process.env.NIBSS_BASE_URL}/api/fintech/onboard`,
    {
      name: process.env.ONBOARD_NAME,
      email: process.env.ONBOARD_EMAIL,
    },
  );
  console.log("Onboarding successful:", response.data);
};

onboard();
