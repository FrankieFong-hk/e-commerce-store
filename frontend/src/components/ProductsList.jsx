// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Trash, Star, Pencil } from "lucide-react";
import useProductStore from "../stores/useProductStore";
import EditProductsModal from "./EditProductsModal";

const ProductsList = () => {
  const { fetchProductById, deleteProduct, toggleFeaturedProduct, products } =
    useProductStore();

  const handleEditButtonClick = async (productId) => {
    try {
      await fetchProductById(productId);
      // Give time for the DOM to update with any React state changes
      setTimeout(() => {
        const modal = document.getElementById("edit_profile_modal");
        if (modal) {
          modal.showModal();
        } else {
          console.error("Edit modal element not found");
        }
      }, 0);
    } catch (error) {
      console.error("Error preparing product for edit:", error);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider "
            >
              Featured
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10">
                    <img
                      className="w-10 h-10 object-cover rounded-lg"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`p-1 rounded-full ${
                      product.isFeatured
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-600 text-gray-300"
                    } hover:bg-yellow-500 transition-colors duration-200`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex justify-center space-x-4">
                  <button
                    className="text-gray-500 hover:text-gray-300"
                    onClick={() => handleEditButtonClick(product._id)}
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditProductsModal />
    </motion.div>
  );
};

export default ProductsList;
