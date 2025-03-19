import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Country = sequelize.define("Country", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  countryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Country;
