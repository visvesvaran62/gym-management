import axios from "axios";
import { API_BASE_URL, getAuthHeaders } from "../utils/auth";

const API_URL = `${API_BASE_URL}/payments`;

export const getPayments = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeaders() });
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await axios.post(API_URL, paymentData, { headers: getAuthHeaders() });
  return response.data;
};

export const updatePaymentStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}`, { status }, { headers: getAuthHeaders() });
  return response.data;
};
