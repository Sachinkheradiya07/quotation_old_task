import fs from "fs";
import path from "path";
import sequelize from "../config/db.js";
import Quotation from "../models/quotationModel.js";
import Consignee from "../models/consigneeModel.js";
import Country from "../models/countryModel.js";
import Currency from "../models/currencyModel.js";
import Port from "../models/portModel.js";
import ProductDetail from "../models/productDetailModel.js";
import Package from "../models/packageModel.js";
import Product from "../models/productModel.js";
import Variant from "../models/variantModel.js";
import { generatePDF } from "../utils/generatePDF.js";
import { fileURLToPath } from "url";
import s3 from "../utils/awsConfig.js";

export const createQuotation = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      quotationNumber,
      date,
      countryId,
      currencyId,
      conversionRate,
      portId,
      productDetails,
      totalNetWeight,
      totalGrossWeight,
      grandTotal,
    } = req.body;

    const createdProductDetails = await Promise.all(
      productDetails.map(async (detail) => {
        return await ProductDetail.create(
          {
            unit: detail.unit,
            quantity: detail.quantity,
            price: detail.price,
            totalPrice: detail.totalPrice,
            netWeight: detail.netWeight,
            grossWeight: detail.grossWeight,
            totalPackages: detail.totalPackages,
            variantId: detail.variantId,
            packageId: detail.packageId,
          },
          { transaction }
        );
      })
    );

    const productDetailIds = createdProductDetails.map((detail) => detail.id);
    //console.log(productDetailIds);

    const unit = productDetails[0].unit;
    //console.log(unit);

    // Create the Quotation entry
    const newQuotation = await Quotation.create(
      {
        date,
        quotationNumber,
        countryId,
        currencyId,
        conversionRate,
        portId,
        unit, // Include unit in the creation
        productDetailId: productDetailIds[0], // Assuming one product detail for simplicity
        totalNetWeight,
        totalGrossWeight,
        grandTotal,
      },
      { transaction }
    );

    //console.log(newQuotation);

    await transaction.commit();
    res.status(201).json(newQuotation);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        {
          model: Consignee,
          attributes: ["consigneeName", "consigneeAddress", "countryId"],
        },
        { model: Country, attributes: ["countryName"] },
        { model: Currency, attributes: ["currency"] },
        { model: Port, attributes: ["portName"] },
        {
          model: ProductDetail,
          attributes: [
            "unit",
            "quantity",
            "price",
            "totalPrice",
            "netWeight",
            "grossWeight",
            "totalPackages",
            "variantId",
            "packageId",
          ],
        },
      ],
    });
    const countries = await Country.findAll();
    const currencies = await Currency.findAll();
    const ports = await Port.findAll();
    const productDetails = await ProductDetail.findAll();
    const packages = await Package.findAll();
    const products = await Product.findAll({
      include: [
        { model: Variant, attributes: ["id", "variantName"], required: false },
      ],
    });
    const consignees = await Consignee.findAll();
    res.render("quotation", {
      quotations,
      countries,
      currencies,
      ports,
      productDetails,
      packages,
      products,
      consignees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [
        { model: Consignee, attributes: ["consigneeName", "consigneeAddress"] },
        { model: Country, attributes: ["countryName"] },
        { model: Currency, attributes: ["currency"] },
        { model: Port, attributes: ["portName"] },
        {
          model: ProductDetail,
          attributes: [
            "unit",
            "quantity",
            "price",
            "totalPrice",
            "netWeight",
            "grossWeight",
            "totalPackages",
            "variantId",
            "packageId",
          ],
        },
      ],
    });
    if (quotation) {
      res.status(200).json(quotation);
    } else {
      res.status(404).json({ message: "Quotation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuotation = async (req, res) => {
  try {
    const [updated] = await Quotation.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedQuotation = await Quotation.findByPk(req.params.id);
      res.status(200).json(updatedQuotation);
    } else {
      res.status(404).json({ message: "Quotation not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const deleted = await Quotation.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).json({ message: "Quotation deleted" });
    } else {
      res.status(404).json({ message: "Quotation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export const downloadPDF = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const quotation = await Quotation.findByPk(id, {
//       include: [
//         { model: Consignee, attributes: ["consigneeName", "consigneeAddress"] },
//         { model: Country, attributes: ["countryName"] },
//         { model: Currency, attributes: ["currency"] },
//         { model: Port, attributes: ["portName"] },
//         {
//           model: ProductDetail,
//           attributes: [
//             "unit",
//             "quantity",
//             "price",
//             "totalPrice",
//             "netWeight",
//             "grossWeight",
//             "totalPackages",
//           ],
//         },
//       ],
//     });

//     if (!quotation) {
//       return res.status(404).json({ message: "Quotation not found" });
//     }

//     // Format date (Remove Time)
//     const formattedDate = new Date(quotation.date).toLocaleDateString();

//     // Ensure ProductDetail is treated as an array
//     const products = quotation.ProductDetail ? [quotation.ProductDetail] : [];

//     if (products.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No product details found for this quotation" });
//     }
//     const imagePath =
//       "https://tse3.mm.bing.net/th?id=OIP.gKvPJ3rFKna1VAMp14J89gHaDb&pid=Api&P=0&h=180";

//     const templatePath = path.join(__dirname, "../utils/pdfTemplate.html");
//     let htmlContent = fs.readFileSync(templatePath, "utf8");

//     htmlContent = htmlContent
//       .replace(
//         'id="quotationNumber"></td>',
//         `id="quotationNumber">${quotation.quotationNumber}</td>`
//       )
//       .replace('id="date"></td>', `id="date">${formattedDate}</td>`) // Updated date format
//       .replace(
//         'id="consigneeName"></td>',
//         `id="consigneeName">${quotation.Consignee?.consigneeName || "N/A"}</td>`
//       )
//       .replace(
//         'id="consigneeAddress"></td>',
//         `id="consigneeAddress">${
//           quotation.Consignee?.consigneeAddress || "N/A"
//         }</td>`
//       )
//       .replace(
//         'id="countryName"></td>',
//         `id="countryName">${quotation.Country?.countryName || "N/A"}</td>`
//       )
//       .replace(
//         'id="currency"></td>',
//         `id="currency">${quotation.Currency?.currency || "N/A"}</td>`
//       )
//       .replace(
//         'id="portName"></td>',
//         `id="portName">${quotation.Port?.portName || "N/A"}</td>`
//       )
//       .replace(
//         'id="totalNetWeight"></td>',
//         `id="totalNetWeight">${quotation.totalNetWeight}</td>`
//       )
//       .replace(
//         'id="totalGrossWeight"></td>',
//         `id="totalGrossWeight">${quotation.totalGrossWeight}</td>`
//       )
//       .replace(
//         'id="grandTotal"></td>',
//         `id="grandTotal">${quotation.grandTotal}</td>`
//       )
//       .replace(
//         '<div id="logo"></div>',
//         `<div id="logo"><img src="${imagePath}" alt="Company Logo" width="150"/></div>`
//       );

//     const productRows = products
//       .map(
//         (product) => `
//       <tr>
//         <td>${product.unit}</td>
//         <td>${product.quantity}</td>
//         <td>${product.price}</td>
//         <td>${product.totalPrice}</td>
//         <td>${product.netWeight}</td>
//         <td>${product.grossWeight}</td>
//         <td>${product.totalPackages}</td>
//       </tr>
//     `
//       )
//       .join("");

//     htmlContent = htmlContent.replace(
//       '<tbody id="productRows"></tbody>',
//       `<tbody id="productRows">${productRows}</tbody>`
//     );

//     const fileName = `Quotation-${quotation.quotationNumber}.pdf`;
//     const pdfPath = await generatePDF(htmlContent, fileName);

//     res.download(pdfPath, fileName);
//   } catch (error) {
//     console.error("Error in PDF download:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const downloadPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findByPk(id, {
      include: [
        { model: Consignee, attributes: ["consigneeName", "consigneeAddress"] },
        { model: Country, attributes: ["countryName"] },
        { model: Currency, attributes: ["currency"] },
        { model: Port, attributes: ["portName"] },
        {
          model: ProductDetail,
          attributes: [
            "unit",
            "quantity",
            "price",
            "totalPrice",
            "netWeight",
            "grossWeight",
            "totalPackages",
          ],
        },
      ],
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const formattedDate = new Date(quotation.date).toLocaleDateString();
    const products = quotation.ProductDetail ? [quotation.ProductDetail] : [];

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No product details found for this quotation" });
    }

    const imagePath =
      "https://tse3.mm.bing.net/th?id=OIP.gKvPJ3rFKna1VAMp14J89gHaDb&pid=Api&P=0&h=180";
    const templatePath = path.join(__dirname, "../utils/pdfTemplate.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    htmlContent = htmlContent
      .replace(
        'id="quotationNumber"></td>',
        `id="quotationNumber">${quotation.quotationNumber}</td>`
      )
      .replace('id="date"></td>', `id="date">${formattedDate}</td>`)
      .replace(
        'id="consigneeName"></td>',
        `id="consigneeName">${quotation.Consignee?.consigneeName || "N/A"}</td>`
      )
      .replace(
        'id="consigneeAddress"></td>',
        `id="consigneeAddress">${
          quotation.Consignee?.consigneeAddress || "N/A"
        }</td>`
      )
      .replace(
        'id="countryName"></td>',
        `id="countryName">${quotation.Country?.countryName || "N/A"}</td>`
      )
      .replace(
        'id="currency"></td>',
        `id="currency">${quotation.Currency?.currency || "N/A"}</td>`
      )
      .replace(
        'id="portName"></td>',
        `id="portName">${quotation.Port?.portName || "N/A"}</td>`
      )
      .replace(
        'id="totalNetWeight"></td>',
        `id="totalNetWeight">${quotation.totalNetWeight}</td>`
      )
      .replace(
        'id="totalGrossWeight"></td>',
        `id="totalGrossWeight">${quotation.totalGrossWeight}</td>`
      )
      .replace(
        'id="grandTotal"></td>',
        `id="grandTotal">${quotation.grandTotal}</td>`
      )
      .replace(
        '<div id="logo"></div>',
        `<div id="logo"><img src="${imagePath}" alt="Company Logo" width="150"/></div>`
      );

    const productRows = products
      .map(
        (product) => ` 
      <tr>
        <td>${product.unit}</td>
        <td>${product.quantity}</td>
        <td>${product.price}</td>
        <td>${product.totalPrice}</td>
        <td>${product.netWeight}</td>
        <td>${product.grossWeight}</td>
        <td>${product.totalPackages}</td>
      </tr>
    `
      )
      .join("");

    htmlContent = htmlContent.replace(
      '<tbody id="productRows"></tbody>',
      `<tbody id="productRows">${productRows}</tbody>`
    );

    const fileName = `Quotation-sachin.pdf`;
    const pdfPath = await generatePDF(htmlContent, fileName);

    // Read PDF file
    const fileContent = fs.readFileSync(pdfPath);

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `quotations/${fileName}`,
      Body: fileContent,
      ContentType: "application/pdf",
    };

    const uploadResult = await s3.upload(params).promise();

    // Generate Pre-Signed URL (Valid for 1 hour)
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `quotations/${fileName}`,
      Expires: 3600, // URL expires in 1 hour
    });

    // Delete the local file after upload
    fs.unlinkSync(pdfPath);

    res.json({
      message: "PDF uploaded successfully",
      url: signedUrl, // Return Pre-Signed URL instead of direct URL
    });
  } catch (error) {
    console.error("Error in PDF upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
