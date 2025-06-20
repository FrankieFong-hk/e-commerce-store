import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not found in redis, find in database
    // .lean() returns plain js object instead of mongoose document
    // which is faster and uses less memory
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json({ featuredProducts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted successfully");
      } catch (error) {
        console.log("Error deleting image", error.message);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    let cloudinaryResponse = null;

    if (req.body.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        cloudinaryResponse = await cloudinary.uploader.upload(req.body.image, {
          folder: "products",
        });
        console.log("Image deleted successfully");
      } catch (error) {
        console.log("Error deleting image", error.message);
      }
    }

    if (product) {
      product.name = req.body.name;
      product.description = req.body.description;
      product.price = req.body.price;
      product.category = req.body.category;
      product.image = cloudinaryResponse?.secure_url
        ? cloudinaryResponse?.secure_url
        : "";
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // The Lean() method returns plain js object instead of full mongoose document
    // which is faster and uses less memory
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updateFeaturedProductsCache", error.message);
  }
}
