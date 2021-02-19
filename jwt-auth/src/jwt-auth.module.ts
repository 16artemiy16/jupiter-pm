import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthController } from './jwt-auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { USER_SERVICE } from "./constants";

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' }
    }),
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
  controllers: [JwtAuthController],
  providers: [
    JwtAuthService
  ],
})
export class JwtAuthModule {}
