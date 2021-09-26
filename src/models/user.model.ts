export interface IUser {
  username: string;
  password: string;
}

export class User implements IUser {
  protected _username: string;
  protected _password: string;

  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }
  get username() {
    return this._username;
  }
  get password() {
    return this._password;
  }
}
