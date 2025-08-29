import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { SupabaseService } from './supabase.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(private readonly supabaseService: SupabaseService) {
    super();
  }

  async validate(token: string) {
    try {
      // Fetch user from Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error || !data.user)
        throw new UnauthorizedException('Invalid Supabase token');

      return data.user; // Successfully authenticated
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
