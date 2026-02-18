import axios from 'axios';

const baseURL =
  import.meta.env.VITE_HN_BASE_URL ?? 'https://hacker-news.firebaseio.com/v0';

export const hnClient = axios.create({
  baseURL,
  timeout: 10000,
});
