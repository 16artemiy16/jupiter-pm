import { UserMsg } from "../../src/constants";
import { of } from "rxjs/internal/observable/of";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserServiceMock {
  static readonly CASES = {
    [UserMsg.ValidateUser]: {
      valid: { _id: '6022361cf0223b65dd149d7c', email: 'valid@test.com', password: 'valid123' },
    }
  };

  static get validateUserSuccessfulCase() {
    return UserServiceMock.CASES[UserMsg.ValidateUser].valid;
  }

  send(msg: string, data: any) {
    if (msg === UserMsg.ValidateUser) {
      return this._validateUser(data)
    }
  }

  private _validateUser({email, password}: { email: string, password: string }) {
    const {
      _id,
      email: validEmail,
      password: validPassword
    } = UserServiceMock.validateUserSuccessfulCase;

    return email === validEmail && password === validPassword
      ? of({ _id, email })
      : of(null);
  }
}