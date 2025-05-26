import express from "express";
import {
  addToCart,
  removeAllFromCart,
  removeAllCartProducts,
  updateQuantity,
  getCartProducts,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/all", protectRoute, removeAllCartProducts);
router.delete("/:productId", protectRoute, removeAllFromCart);
router.put("/:productId", protectRoute, updateQuantity);

export default router;
