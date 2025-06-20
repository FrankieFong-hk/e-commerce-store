import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      set({ user: response.data, loading: false });
      toast.success("Signup successful");
    } catch (error) {
      set({ loading: false });
      console.error("Signup failed:", error);
      toast.error(error.response.data.error || "Signup failed");
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const response = await axios.post("/auth/login", { email, password });
      set({ user: response.data, loading: false });
      toast.success("Login successful");
    } catch (error) {
      set({ loading: false });
      console.error("Login failed:", error);
      toast.error(error.response.data.error || "Login failed");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response.data.error || "Logout failed");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.error("Auth check failed:", error);
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh requests
    if (get().checkingAuth) return;

    set({ checkingAuth: true });

    try {
      console.log("Refreshing access token...");
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

export default useUserStore;

// TODO: Implement the axios interceptors for refreshing the access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
