import { Body, Controller, Inject, OnApplicationBootstrap, Post, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from "@nestjs/microservices";
import { tap } from "rxjs/operators";
import { JWT_SERVICE, JwtMsg } from "../constants";


@Controller('auth')
export class JwtController implements OnApplicationBootstrap {
  constructor(
    @Inject(JWT_SERVICE) private readonly jwtServiceClient: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this.jwtServiceClient.connect();
  }

  @Post('login')
  get(@Body('email') email: string, @Body('password') password: string) {
    return this.jwtServiceClient
      .send(JwtMsg.Login, { email, password })
      .pipe(
        tap((jwt) => {
          if (jwt === null) {
            throw new UnauthorizedException();
          }
        })
      );
  }
}
