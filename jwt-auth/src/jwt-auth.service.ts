import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, map } from "rxjs/operators";
import { USER_SERVICE, UserMsg } from "./constants";
import { from } from "rxjs/internal/observable/from";
import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy
  ) {}

  login(email: string, password: string) {
    return this.userServiceClient
      .send(UserMsg.ValidateUser, { email, password })
      .pipe(
        map((user) => {
          return user
            ? this.jwtService.sign({
              _id: user._id,
              email: user.email
            })
            : null
        })
      );
  }

  verify(token: string): Observable<boolean> {
    return from(
      this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      })
    )
      .pipe(
        catchError(() => of(false)),
      )
  }
}
