import express from "express";
import {
  createPackage,
  getAllPackages,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

const router = express.Router();

router.get("/", getAllPackages);
router.post("/create-package", createPackage);
router.put("/edit/:id", updatePackage);
router.delete("/delete/:id", deletePackage);

export default router;
