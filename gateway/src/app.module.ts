import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { UserController } from './controllers/user.controller';
import { USER_SERVICE } from "./constants";
import { ConfigModule } from "@nestjs/config";

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
      }
    ])
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
