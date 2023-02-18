import FourOFourError from "../utils/errors/FourOFour";
import validate from "../validations/signature";

export default async (req, res, next) => {
  console.log(req.params);
  const { error } = validate({ signature: req.params.signature });
  if (error) {
    throw new FourOFourError({ message: error.details[0].message });
  }
  next();
};
