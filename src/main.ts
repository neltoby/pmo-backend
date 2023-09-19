import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4500;

  const { SwaggerModule, DocumentBuilder } = await importDynamic(
    '@nestjs/swagger',
  );

  const config = new DocumentBuilder()
    .setTitle('PMO Project')
    .setDescription('The PMO project API description')
    .setVersion('1.0')
    .addTag('pmos')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap();
