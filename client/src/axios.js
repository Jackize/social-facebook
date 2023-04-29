import axios from "axios";
import { CLOUD_NAME, CLOUD_PRESET, URL_BE } from "./utils/config";

export const makeRequest = axios.create({
  baseURL: URL_BE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
});

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