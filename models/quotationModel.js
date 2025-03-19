import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Consignee from "./consigneeModel.js";
import Country from "./countryModel.js";
import Currency from "./currencyModel.js";
import Port from "./portModel.js";
import ProductDetail from "./productDetailModel.js";

const Quotation = sequelize.define("Quotation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quotationNumber: {
    type: DataTypes.INTEGER,
    references: {
      model: Consignee,
      key: "quotationNumber",
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
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
  countryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Country,
      key: "id",
    },
  },
  currencyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Currency,
      key: "id",
    },
  },
  conversionRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  portId: {
    type: DataTypes.INTEGER,
    references: {
      model: Port,
      key: "id",
    },
  },
  productDetailId: {
    type: DataTypes.INTEGER,
    references: {
      model: ProductDetail,
      key: "id",
    },
  },
  totalNetWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalGrossWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Consignee.hasMany(Quotation, { foreignKey: "quotationNumber" });
Quotation.belongsTo(Consignee, { foreignKey: "quotationNumber" });

Country.hasMany(Quotation, { foreignKey: "countryId" });
Quotation.belongsTo(Country, { foreignKey: "countryId" });

Currency.hasMany(Quotation, { foreignKey: "currencyId" });
Quotation.belongsTo(Currency, { foreignKey: "currencyId" });

Port.hasMany(Quotation, { foreignKey: "portId" });
Quotation.belongsTo(Port, { foreignKey: "portId" });

ProductDetail.hasMany(Quotation, { foreignKey: "productDetailId" });
Quotation.belongsTo(ProductDetail, { foreignKey: "productDetailId" });

export default Quotation;
