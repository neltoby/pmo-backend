import * as Joi from 'joi';

export const validationSchema = (port: number) =>
  Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    PORT: Joi.number().default(port),
    JWT_SECRET: Joi.string(),
    MONGO_URL: Joi.string(),
    REDIS_HOST: Joi.string(),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string(),
    MAILTRAP_HOST: Joi.string(),
    MAILTRAP_PORT: Joi.number().default(2525),
    MAILTRAP_AUTH_USER: Joi.string(),
    MAILTRAP_AUTH_PASS: Joi.string(),
  });
