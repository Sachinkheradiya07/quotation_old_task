import Product from "../models/productModel.js";
import Variant from "../models/variantModel.js";

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      gst,
      description,
      hsnSac,
      inventoryType,
      productTag,
      unit,
      netWeight,
      grossWeight,
      dimensionLength,
      dimensionWidth,
      dimensionHeight,
      sellPrice,
    } = req.body;

    const productImage = req.files?.productImage?.[0]?.filename || null;

    const product = await Product.create({
      productName,
      productImage,
      gst,
      description,
      hsnSac,
      inventoryType,
      productTag,
      unit,
      netWeight,
      grossWeight,
      dimensionLength,
      dimensionWidth,
      dimensionHeight,
      sellPrice,
    });

    const variants = [];
    for (const key in req.body) {
      if (key.startsWith("variantName_")) {
        const index = key.split("_")[1];
        variants.push({
          variantName: req.body[key],
          variantImage:
            req.files[`variantImage_${index}`]?.[0]?.filename || null,
          productId: product.id,
        });
      }
    }

    await Variant.bulkCreate(variants);

    const products = await Product.findAll({
      include: Variant,
    });

    res.render("productList", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      gst,
      description,
      hsnSac,
      inventoryType,
      productTag,
      unit,
      netWeight,
      grossWeight,
      dimensionLength,
      dimensionWidth,
      dimensionHeight,
      sellPrice,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productImage =
      req.files?.productImage?.[0]?.filename || product.productImage;

    await product.update({
      productName,
      productImage,
      gst,
      description,
      hsnSac,
      inventoryType,
      productTag,
      unit,
      netWeight,
      grossWeight,
      dimensionLength,
      dimensionWidth,
      dimensionHeight,
      sellPrice,
    });

    const variants = [];
    for (const key in req.body) {
      if (key.startsWith("variantName_")) {
        const index = key.split("_")[1];
        variants.push({
          variantName: req.body[key],
          variantImage:
            req.files[`variantImage_${index}`]?.[0]?.filename || null,
          productId: product.id,
        });
      }
    }

    await Variant.destroy({ where: { productId: product.id } });
    await Variant.bulkCreate(variants);

    const products = await Product.findAll({
      include: Variant,
    });

    res.render("productList", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renderEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: Variant,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.render("productEdit", { product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await Variant.destroy({ where: { productId: product.id } });
    await product.destroy();

    res.redirect("/product/list");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Variant,
    });

    res.render("productList", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDropdown = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Variant,
    });

    res.render("productDropdown", { products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
