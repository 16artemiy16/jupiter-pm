import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { BoardModule } from './board.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BoardModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: process.env.AMQP_QUEUE_BOARDS
    }
  });

  await app.listen(() => console.log('Boards microservice started'));
}
bootstrap();
