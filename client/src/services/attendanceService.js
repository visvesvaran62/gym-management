import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../utils/auth";

const API_URL = `${API_BASE_URL}/attendance`;

export const getAttendance = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const markAttendance = async (data) => {
  const response = await axios.post(API_URL, data, { headers: getAuthHeaders() });
  return response.data;
};
