import axios from "axios";

const API = "http://127.0.0.1:8000";
// Login
export const loginUser = (data: { username: string; password: string }) =>
  axios.post(`${API}/api/login/`, data);
// Users
export const getUsers = () => axios.get(`${API}/users`);
export const createUser = (data: FormData) => axios.post(`${API}/users`, data);
export const deleteUser = (id: number) => axios.delete(`${API}/users/${id}`);
export const updateUser = (id: number, data: FormData) =>
  axios.put(`${API}/users/${id}`, data);