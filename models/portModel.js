import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Country from "./countryModel.js";

const Port = sequelize.define("Port", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  portName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Country,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

Country.hasMany(Port, { foreignKey: "countryId", onDelete: "CASCADE" });
Port.belongsTo(Country, { foreignKey: "countryId" });

export default Port;
