import winston from "winston";
import express from "express";
import loadInitialVariables from "./startup/config";
import unhandledLogging from "./startup/unhandledLogging";
import cors from "./startup/cors";
import routes from "./startup/routes";

// global winston transporter
winston.add(new winston.transports.Console());

const app = express();

// make sure required variables are loaded sucessfully
loadInitialVariables();

// handle and log uncaughtException , unhandledRejection (terminate on => unhandledRejection )
unhandledLogging();

cors(app);
routes(app);

app.get("*", (req, res) => {
  res.status(400).send("Invalid Request!");
});

const PORT = process.env.PORT || process.env.port;

app.listen(PORT, winston.info(`Server started at port: ${PORT}`));
