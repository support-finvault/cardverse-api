import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'Authentication token is missing in the request headers',
      );
    }

    // Optional: Check if token is in Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid token format. Please provide a Bearer token',
      );
    }

    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) return false;

    const user = request.user; // Extracted from SupabaseStrategy

    // Ensure the user exists in the custom database
    let existingUser = await this.usersService.findOneByProviderAuthId(user.id);

    if (!existingUser) {
      existingUser = await this.usersService.createMinimalUser(
        user.id,
        user.email,
        user.phone,
      );
    }

    // Attach the user data to the request for later use
    request.user = existingUser;
    return true;
  }
}
