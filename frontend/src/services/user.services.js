import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

export const preRegisterRequest = async (user) => {
  return await axios.post(`${API_URL}/pre-register`, user);
};