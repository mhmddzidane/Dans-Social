import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://danssocial-api.vercel.app/api/",
  withCredentials: true,
});
