const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../config.env");
console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });
exports.appConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT) || 8000,
  MONGO_URI: process.env.MONGO_URI,
  LOCAL_MONGO_URI: process.env.LOCAL_MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || `Support@123#@!`,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BASE_URL: process.env.AWS_BASE_URL,
  CIPHER_SECRET_KEY: process.env.CIPHER_SECRET_KEY,
};
