import React from "react";
import useCartStore from "../stores/useCartStore";
import { Minus, Plus, Trash } from "lucide-react";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div className="shrink-0">
          <img
            className="h-20 w-20 md:h-32 md:w-32 rounded object-cover"
            src={item.image}
          />
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.name}
          </p>
          <p className="text-sm text-gray-400">{item.description}</p>
        </div>

        <div className="flex items-center justify-start md:justify-center gap-4">
          <button
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							  focus:ring-emerald-500"
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
          >
            <Minus className="text-gray-300" />
          </button>
          <p>{item.quantity}</p>
          <button
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none 
						focus:ring-2 focus:ring-emerald-500"
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <Plus className="text-gray-300" />
          </button>
        </div>

        <div className="flex items-center gap-4 justify-between">
          <div className="text-end md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ${item.price}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline"
              onClick={() => removeFromCart(item._id)}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
