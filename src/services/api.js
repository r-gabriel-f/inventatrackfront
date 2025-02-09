import axios from "axios";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers,
});

export default instance;