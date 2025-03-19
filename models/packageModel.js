import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Package = sequelize.define("Package", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
});

export default Package;
