import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Currency = sequelize.define("Currency", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Currency;
