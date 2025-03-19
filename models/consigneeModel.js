import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Country from "./countryModel.js";

const Consignee = sequelize.define("Consignee", {
  quotationNumber: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  consigneeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  consigneeAddress: {
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
  },
});

Country.hasMany(Consignee, { foreignKey: "countryId", onDelete: "CASCADE" });
Consignee.belongsTo(Country, { foreignKey: "countryId" });

export default Consignee;
