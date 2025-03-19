import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hsnSac: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gst: {
    type: DataTypes.STRING,
    defaultValue: 0,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  inventoryType: {
    type: DataTypes.ENUM("Finished Goods", "Rejection", "Raw Material"),
    allowNull: false,
  },
  productTag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unit: {
    type: DataTypes.ENUM(
      "MT (KG)",
      "LT (ML)",
      "TON",
      "Pieces",
      "KG (KG)",
      "BOTTLES (KG)",
      "JAR (GM)",
      "CAN (KG)",
      "BOX (GM)",
      "PCS (KG)",
      "BAGS (KG)"
    ),
    allowNull: false,
  },
  netWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  grossWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dimensionLength: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dimensionWidth: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dimensionHeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  sellPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Product;
