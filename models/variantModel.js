import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Product from "./productModel.js";

const Variant = sequelize.define("Variant", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  variantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variantImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Product.hasMany(Variant, { foreignKey: "productId", onDelete: "CASCADE" });
Variant.belongsTo(Product, { foreignKey: "productId" });

export default Variant;
