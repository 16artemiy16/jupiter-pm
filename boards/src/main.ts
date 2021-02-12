import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { TaskManagementModule } from './task-management.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskManagementModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: process.env.AMQP_QUEUE_BOARDS
    }
  });

  await app.listen(() => console.log('Boards microservice started'));
}
bootstrap();
