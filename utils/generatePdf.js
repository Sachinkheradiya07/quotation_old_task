import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = async (htmlContent, fileName) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfPath = path.join(__dirname, "../uploads", fileName);
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();
    return pdfPath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("PDF generation failed");
  }
};
