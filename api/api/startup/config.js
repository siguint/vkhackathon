import "dotenv/config";

const loadInitialVariables = () => {
  if (!process.env.PORT && !process.env.port) {
    throw new Error("FATAL ERROR: PORT not defined");
  }

  // check for other startup variables too..
};

export default loadInitialVariables;
