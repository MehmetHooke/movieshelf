import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`, // (token ise OK)
  },
});
