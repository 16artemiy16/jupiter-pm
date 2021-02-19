import { Controller } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { MessagePattern } from "@nestjs/microservices";
import { Observable } from "rxjs/internal/Observable";
import { JwtMsg } from "./constants";
import { map } from "rxjs/operators";

@Controller()
export class JwtAuthController {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  @MessagePattern(JwtMsg.Login)
  login({ email, password }): Observable<{ jwt: string }> {
    return this.jwtAuthService
      .login(email, password)
      .pipe(
        map((jwt) => ({ jwt }))
      );
  }

  @MessagePattern(JwtMsg.Verify)
  verify(token: string) {
    return this.jwtAuthService.verify(token);
  }
}
