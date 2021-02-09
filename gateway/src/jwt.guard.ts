import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWT_SERVICE, JwtMsg } from "./constants";
import { ClientProxy } from "@nestjs/microservices";
import { of } from "rxjs/internal/observable/of";
import { catchError, map, switchMap, tap } from "rxjs/operators";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(JWT_SERVICE) private readonly jwtServiceClient: ClientProxy
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return of(req.headers.authorization)
      .pipe(
        map((authHeader: string) => authHeader.split(' ')[1]),
        switchMap((bearerToken: string) => {
          return !bearerToken
            ? of(false)
            : this.jwtServiceClient.send(JwtMsg.Verify, bearerToken);
        }),
        tap((user) => {
          if (user) {
            req.user = user;
          }
        }),
        catchError(() => of(false))
      );
  }
}
