import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: process.env.AMQP_QUEUE_USERS
    }
  });
  await app.listen(() => console.log('Users microservice started'));
}
bootstrap();
