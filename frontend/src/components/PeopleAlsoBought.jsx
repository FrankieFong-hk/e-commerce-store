import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("/products/recommendations");
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-emerald-400">
        People Also Bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
