import logger from "../startup/logging";

export default (err, req, res, next) => {
  console.log(err);
  logger.log({
    level: "error",
    message: err.message,
  });
  const error = err;
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  if (error.statusCode === 301) {
    return res.status(301).json({ message: "Invalid request!" });
  }
  if (error) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return next();
};
