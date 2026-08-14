import axios, { AxiosInstance } from "axios";
import getNibssToken from "../utils/nibssAuth";

const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;

const nibssRequest = async (): Promise<AxiosInstance> => {
  const token = await getNibssToken();

  return axios.create({
    baseURL: NIBSS_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const nibssPublicRequest = (): AxiosInstance => {
  return axios.create({
    baseURL: NIBSS_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { nibssRequest, nibssPublicRequest };
