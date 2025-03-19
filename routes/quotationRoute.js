import express from "express";
import {
  createQuotation,
  getAllQuotations,
  updateQuotation,
  deleteQuotation,
  downloadPDF,
  getQuotationById,
} from "../controllers/quotationController.js";

const router = express.Router();

router.post("/", createQuotation);
router.get("/", getAllQuotations);
router.get("/:id/download", downloadPDF);
router.get("/:id", getQuotationById);
router.put("/edit/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

export default router;
