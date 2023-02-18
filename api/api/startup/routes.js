import bodyParser from "body-parser";

import adminRoutes from "../routes/admin";
import userRoutes from "../routes/user";
import commonRoutes from "../routes/common";

import errorHandler from "../middlewares/error";

export default (app) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // add routes here
  app.use("/api/admin", adminRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/common", commonRoutes);

  app.use(errorHandler);
};
