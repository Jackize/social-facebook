
import axios from "axios";
import store from "./redux/store";
import { clearUser } from "./redux/userSlice";
import { CLOUD_NAME, CLOUD_PRESET, URL_BE } from "./utils/config";
import queryClient from "./utils/query";

export const makeRequest = axios.create({
  baseURL: URL_BE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
  }
});
// Request interceptor for attaching the token
makeRequest.interceptors.request.use(
  (config) => {
    const token = store.getState().user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
makeRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Token expired or invalid, log out the user
      store.dispatch(clearUser());
      queryClient.clear(); // Clear the TanStack Query cache
      // Optionally, redirect to the login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return res.data.url;
  } catch (error) {
    console.log(error);
  }
};