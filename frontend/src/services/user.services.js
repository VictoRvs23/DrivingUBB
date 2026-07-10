import axios from "axios";
import { API_BASE_URL } from '../config/api.js';

const API_URL = `${API_BASE_URL}/api/users`;

const getConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const preRegisterRequest = async (formDataObject) => {
  return await axios.post(`${API_URL}/pre-register`, formDataObject, {
      headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getUsersRequest = async () => {
    return await axios.get(API_URL, getConfig());
};

export const createUserRequest = async (userData) => {
    return await axios.post(API_URL, userData, getConfig());
};

export const updateUserRequest = async (id, userData) => {
    return await axios.put(`${API_URL}/${id}`, userData, getConfig());
};

export const deleteUserRequest = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, getConfig());
};