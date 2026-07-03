import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../utils/auth";

const API_URL = `${API_BASE_URL}/trainers`;

export const getTrainers = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createTrainer = async (trainerData) => {
  const response = await axios.post(API_URL, trainerData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteTrainer = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const updateTrainer = async (id, trainerData) => {
  const response = await axios.put(`${API_URL}/${id}`, trainerData, { headers: getAuthHeaders() });
  return response.data;
};
