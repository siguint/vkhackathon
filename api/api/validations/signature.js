import Joi from "joi";
import Web3 from "web3";

const signatureSchema = Joi.object({
  signature: Joi.string()
    .custom((value, helper) => {
      const isValidSignature = !!value;
      if (!isValidSignature) {
        return helper.message("Invalid signature!");
      }
      return true;
    })
    .required(),
});

// eslint-disable-next-line max-len, camelcase
const validateSignature = ({ signature }) =>
  signatureSchema.validate({ signature });

export default validateSignature;
