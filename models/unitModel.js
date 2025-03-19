import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Unit = sequelize.define("Unit", {
  orderUnit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  packingUnit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

export default Unit;
