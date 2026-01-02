const requiredEnvs = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
];

export function validateEnv() {
  for (const key of requiredEnvs) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}
