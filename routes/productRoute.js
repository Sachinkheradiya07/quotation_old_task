import express from "express";

import {
  createProduct,
  updateProduct,
  renderEditProduct,
  deleteProduct,
  getAllProducts,
  getDropdown,
} from "../controllers/productController.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post(
  "/create-product",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "variantImage_0", maxCount: 1 },
    { name: "variantImage_1", maxCount: 1 },
    { name: "variantImage_2", maxCount: 1 },
    { name: "variantImage_3", maxCount: 1 },
    { name: "variantImage_4", maxCount: 1 },
    { name: "variantImage_5", maxCount: 1 },
    { name: "variantImage_6", maxCount: 1 },
    { name: "variantImage_7", maxCount: 1 },
    { name: "variantImage_8", maxCount: 1 },
    { name: "variantImage_9", maxCount: 1 },
  ]),
  createProduct
);

router.get("/edit/:id", renderEditProduct);

router.post(
  "/update-product/:id",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "variantImage_0", maxCount: 1 },
    { name: "variantImage_1", maxCount: 1 },
    { name: "variantImage_2", maxCount: 1 },
    { name: "variantImage_3", maxCount: 1 },
    { name: "variantImage_4", maxCount: 1 },
    { name: "variantImage_5", maxCount: 1 },
    { name: "variantImage_6", maxCount: 1 },
    { name: "variantImage_7", maxCount: 1 },
    { name: "variantImage_8", maxCount: 1 },
    { name: "variantImage_9", maxCount: 1 },
  ]),
  updateProduct
);

router.delete("/delete/:id", deleteProduct);

router.get("/dropdown", getDropdown);
router.get("/list", getAllProducts);

export default router;
