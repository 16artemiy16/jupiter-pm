import { Controller } from '@nestjs/common';
import { JwtAuthService } from './jwt-auth.service';
import { MessagePattern } from "@nestjs/microservices";
import { Observable } from "rxjs/internal/Observable";
import { JwtMsg } from "./constants";

@Controller()
export class JwtAuthController {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  @MessagePattern(JwtMsg.Login)
  login({ email, password }): Observable<any> {
    return this.jwtAuthService.login(email, password);
  }
}
