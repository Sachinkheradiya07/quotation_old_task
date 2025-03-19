import productRoutes from "./productRoute.js";
import unitRoutes from "./unitRoute.js";
import packageRoutes from "./packageRoute.js";
import quotationRoutes from "./quotationRoute.js";

const initialRouter = (app) => {
  app.get("/product-form", (req, res) => {
    res.render("product");
  });

  app.use("/product", productRoutes);
  app.use("/unit", unitRoutes);
  app.use("/package", packageRoutes);
  app.use("/quotation", quotationRoutes);
};

export default initialRouter;
