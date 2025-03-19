import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Variant from "./variantModel.js";
import Package from "./packageModel.js";

const ProductDetail = sequelize.define("ProductDetail", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  unit: {
    type: DataTypes.ENUM,
    values: [
      "MT(KG)",
      "LT(ML)",
      "TON",
      "Pieces",
      "KG(KG)",
      "BOTTLES(KG)",
      "JAR(GM)",
      "CAN(KG)",
      "BOX(GM)",
      "PCS(KG)",
      "BAGS(KG)",
    ],
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
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
  totalPackages: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  variantId: {
    type: DataTypes.INTEGER,
    references: {
      model: Variant,
      key: "id",
    },
  },
  packageId: {
    type: DataTypes.INTEGER,
    references: {
      model: Package,
      key: "id",
    },
  },
});

Variant.hasMany(ProductDetail, { foreignKey: "variantId" });
ProductDetail.belongsTo(Variant, { foreignKey: "variantId" });

Package.hasMany(ProductDetail, { foreignKey: "packageId" });
ProductDetail.belongsTo(Package, { foreignKey: "packageId" });

export default ProductDetail;
