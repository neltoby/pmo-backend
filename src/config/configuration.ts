export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.MONGO_URL,
  nodeEnv: process.env.NODE_ENV,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  mailtrapHost: process.env.MAILTRAP_HOST,
  mailtrapPort: process.env.MAILTRAP_PORT,
  mailtrapAuthUser: process.env.MAILTRAP_AUTH_USER,
  mailtrapAuthPass: process.env.MAILTRAP_AUTH_PASS,
  // database: {
  //   host: process.env.DATABASE_HOST,
  //   port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  // },
});
