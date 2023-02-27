import dotenv from "dotenv";

dotenv.config({ path: __dirname + "../.env" });

const MONGO_URI = process.env.MONGO_URI || "";

const config = {
  MONGO_URI,
};

export default config;
