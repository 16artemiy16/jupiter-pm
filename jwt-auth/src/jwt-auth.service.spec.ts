import { JwtAuthService } from "./jwt-auth.service";
import { Test } from "@nestjs/testing";
import { USER_SERVICE } from "./constants";
import { UserServiceMock } from "../test/unit/user.service.mock";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { omit } from "./utils/object/omit.util";

describe('JwtAuthService', () => {
  let jwtAuthService: JwtAuthService;
  let jwtService: JwtService;
  let userServiceClient: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret'
        })
      ],
      providers: [
        JwtAuthService,
        {
          provide: USER_SERVICE,
          useClass: UserServiceMock
        }
      ]
    }).compile();

    jwtAuthService = moduleRef.get<JwtAuthService>(JwtAuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userServiceClient = moduleRef.get(USER_SERVICE);
  });

  it('should be defined', () => {
    expect(jwtAuthService).toBeTruthy();
  });

  describe('login()', () => {
    it('should return decoded { _id, email } if the credentials are correct', () => {
      const { _id, email, password } = UserServiceMock.validateUserSuccessfulCase;
      jwtAuthService
        .login(email, password)
        .subscribe((jwtOrNull) => {
          const decoded = jwtService.decode(jwtOrNull);
          expect(omit(decoded as Record<string, any>, 'iat')).toEqual({ _id, email });
        })
    });

    it('should return null if the credentials are not correct', () => {
      jwtAuthService
        .login('does-not-exist@test.com', '123lalala')
        .subscribe((jwtOrNull) => {
          expect(jwtOrNull).toBeNull();
        })
    });
  });

  describe('verify()', () => {
    it('should return the decoded object if the token is correct', () => {
      const objToSign = {
        _id: '_id',
        email: 'email@test.com',
      };

      const token = jwtService.sign(objToSign);

      jwtAuthService
        .verify(token)
        .subscribe((decoded) => {
          expect(omit(decoded, 'iat')).toEqual(objToSign)
        })
    });
    it('should return false if the token is incorrect', () => {
      const objToSign = {
        _id: '_id',
        email: 'email@test.com',
      };

      const token = jwtService.sign(objToSign, { secret: 'different secret' });

      jwtAuthService
        .verify(token)
        .subscribe((decoded) => {
          expect(decoded).toBe(false);
        })
    })
  });
});