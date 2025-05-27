import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const useProductStore = create((set) => ({
  products: [],
  singleProduct: null,
  loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error || "Failed to create product");
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: error.response.data.error, loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchProductById: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/${productId}`);
      set({ singleProduct: res.data.product, loading: false });
    } catch (error) {
      set({ error: error.response.data.error, loading: false });
      toast.error(error.response.data.error || "Failed to fetch product");
    }
  },

  updateProduct: async (productId, productData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/products/${productId}`, productData);
      const updatedProduct = res.data;

      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId ? updatedProduct : product
        ),
        singleProduct: updatedProduct, // Keep the singleProduct reference instead of null
        loading: false,
      }));

      toast.success("Product updated successfully");
    } catch (error) {
      toast.error(error.response.data.error || "Failed to update product");
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ error: error.response.data.error, loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      set({ error: error.response.data.error, loading: false });
      toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);

      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error || "Failed to delete product");
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });

    try {
      const res = await axios.patch(`/products/featured/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(
        error.response.data.error || "Failed to toggle featured product"
      );
      set({ loading: false });
    }
  },
}));

export default useProductStore;
