import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  coupon: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotal();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.error || "Failed to fetch cart items");
    }
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotal();
    } catch (error) {
      toast.error(error.response.data.error || "Failed to add to cart");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/${productId}`);
      toast.success("Product removed from cart");
      set((prevState) => {
        const newCart = prevState.cart.filter((item) => item._id !== productId);
        return { cart: newCart };
      });
      get().calculateTotal();
    } catch (error) {
      toast.error(error.response.data.error || "Failed to remove from cart");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`/cart/${productId}`, { quantity });
      toast.success("Quantity updated");
      set((prevState) => {
        const newCart = prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        );
        return { cart: newCart };
      });
      get().calculateTotal();
    } catch (error) {
      toast.error(error.response.data.error || "Failed to update quantity");
    }
  },

  calculateTotal: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));

export default useCartStore;
