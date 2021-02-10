import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { BOARD_SERVICE, JWT_SERVICE, USER_SERVICE } from "./constants";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from './controllers/auth.controller';
import { BoardController } from './controllers/board.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: process.env.AMQP_QUEUE_USERS
        }
      },
      {
        name: JWT_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: process.env.AMQP_QUEUE_JWT
        }
      },
      {
        name: BOARD_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL],
          queue: process.env.AMQP_QUEUE_BOARDS
        }
      }
    ])
  ],
  controllers: [AppController, UserController, AuthController, BoardController],
  providers: [AppService],
})
export class AppModule {}
