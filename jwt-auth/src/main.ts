import { NestFactory } from '@nestjs/core';
import { JwtAuthModule } from './jwt-auth.module';
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(JwtAuthModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: process.env.AMQP_QUEUE_JWT
    }
  });
  app.listen(() => console.log('JwtAuth microservice is listening'));
}
bootstrap();
