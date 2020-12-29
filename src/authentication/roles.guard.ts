import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/entities/user.entity';
import { Role } from '../entities/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) {
      return false;
    }
    return roles.every((role) => user.roles && user.roles.includes(role));
  }
}
