import express from "express";
import {
  createUnit,
  getAllUnits,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";

const router = express.Router();

router.get("/", getAllUnits);
router.post("/create-unit", createUnit);
router.put("/edit/:id", updateUnit);
router.delete("/delete/:id", deleteUnit);

export default router;
