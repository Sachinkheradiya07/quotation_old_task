import express from "express";
import "./config/db.js";
import dotenv from "dotenv";
import initialRouter from "./routes/index.js";
import methodOverride from "method-override";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initialRouter(app);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is runing is", PORT);
});
