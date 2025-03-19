import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

const checkDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection  successfully.");

    await sequelize.sync({ alter: true });
    console.log("All Tables Synced Successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
checkDatabaseConnection();

export default sequelize;
