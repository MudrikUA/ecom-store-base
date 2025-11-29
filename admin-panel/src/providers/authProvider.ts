import { AuthProvider } from "react-admin";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth"; // 🔹 URL до твого бекенду

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await axios.post(`${API_URL}/admin-login`, { email:username, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token); // ✅ Зберігаємо токен
        return Promise.resolve();
      } else {
        return Promise.reject("Invalid credentials");
      }
    } catch (error) {
      return Promise.reject(error.response?.data?.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => Promise.resolve(), // 🔹 Якщо буде підтримка ролей — реалізуй тут
};

export default authProvider;
