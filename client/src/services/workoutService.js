import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../utils/auth";

const API_URL = `${API_BASE_URL}/workouts`;

export const getWorkouts = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await axios.post(API_URL, workoutData, { headers: getAuthHeaders() });
  return response.data;
};

export const updateWorkout = async (id, workoutData) => {
  const response = await axios.put(`${API_URL}/${id}`, workoutData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};
