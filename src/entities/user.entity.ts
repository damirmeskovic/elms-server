import { Role } from './role.enum';

export interface User {
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly roles?: Role[];
  readonly name?: string;
  readonly bio?: string;
}
