import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let isValidRole = false;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!roles) {
      isValidRole = true;
    } else {
      isValidRole = this.matchRoles(roles, user)
    }
    return isValidRole;
  }

  matchRoles(grants: string[], user: any) {
    return grants.some(grant => user[grant]);
  }
}
