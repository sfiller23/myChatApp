export class User{
  public id: string | undefined;
  public username: string | undefined;
  public email: string | undefined;
  public password: string | undefined;
  public isLogedin: boolean | undefined;

  constructor(id?: string, username?: string, email?: string, password?: string, isLogedin?: boolean){
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isLogedin = isLogedin;
  }
}
