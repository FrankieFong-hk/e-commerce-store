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
}));

export default useUserStore;

// TODO: Implement the axios interceptors for refreshing the access token
