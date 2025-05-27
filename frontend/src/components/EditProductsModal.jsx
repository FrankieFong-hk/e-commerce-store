import React, { useState, useEffect } from "react";
import { Loader, Upload } from "lucide-react";
import useProductStore from "../stores/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const EditProductsModal = () => {
  const { updateProduct, loading, singleProduct } = useProductStore();
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (singleProduct) {
      setEditedProduct({
        name: singleProduct.name || "",
        description: singleProduct.description || "",
        price: singleProduct.price || "",
        category: singleProduct.category || "",
        image: singleProduct.image || "",
      });
    }
  }, [singleProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setEditedProduct({ ...editedProduct, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (singleProduct && singleProduct._id) {
      await updateProduct(singleProduct._id, editedProduct);

      // Use a more reliable way to get and close the modal
      const modal = document.getElementById("edit_profile_modal");
      if (modal) {
        modal.close();
      } else {
        console.error("Modal element not found");
        // Fallback: Try to reset the form state even if we can't close the modal
        setEditedProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          image: "",
        });
      }
    }
  };

  return (
    <div>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Product</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Product Name
              </label>
              <input
                // id="name"
                name="name"
                type="text"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
                className="mt-1 block w-full bg-gray-700 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editedProduct.description}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    description: e.target.value,
                  })
                }
                rows="3"
                className="mt-1 block w-full bg-gray-700 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300"
              >
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={editedProduct.price}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, price: e.target.value })
                }
                step="0.01"
                className="mt-1 block w-full bg-gray-700 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={editedProduct.category}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    category: e.target.value,
                  })
                }
                className="mt-1 block w-full bg-gray-700 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="image"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Upload className="h-5 w-5 inline-block mr-2" />
                Upload Image
              </label>
            </div>

            <div>
              {editedProduct.image && (
                <img
                  src={editedProduct.image}
                  alt="Product"
                  className="mt-2 w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  document.getElementById("edit_profile_modal").close();
                  setEditedProduct({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    image: "",
                  });
                }}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="inline-block mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default EditProductsModal;
