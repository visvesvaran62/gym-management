import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../utils/auth";

const API_URL = `${API_BASE_URL}/members`;

export const getMembers = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createMember = async (memberData) => {
  const response = await axios.post(API_URL, memberData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateMember = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteMember = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
