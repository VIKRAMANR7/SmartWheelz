const requiredEnvs = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
] as const;

export function validateEnv(): void {
  const missing = requiredEnvs.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}
