export interface User {
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly name?: string;
  readonly bio?: string;
}
