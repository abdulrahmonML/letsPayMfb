// NIBSS base URL + axios instance

const axios = require("axios");
const getNibssToken = require("../utils/nibssAuth");

const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;

// we write a function that makes sure we don't have to always write the BASE URL and axios instance everywhere as we get to use it in every function in this file.

const nibssRequest = async () => {
  const token = await getNibssToken();

  return axios.create({
    baseURL: NIBSS_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

module.exports = nibssRequest;
