import axios from "axios";
import { getIdToken } from "./authToken";

const api = axios.create({
  baseURL: "http://localhost:8080", // your Spring backend
});

api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
