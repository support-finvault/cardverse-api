import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ValidationException } from 'src/common/validation.exception';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async verifyUser(token: string) {
    try {
      // Verify token using Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error) {
        throw new ValidationException([
          'The provided token is either invalid or expired',
        ]);
      }

      if (data?.user?.email_confirmed_at) {
        return { message: 'Email verified successfully!' };
      }

      throw new InternalServerErrorException('Something went wrong');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signUp(email: string, password: string) {
    try {
      // Register user with Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email,
          password,
        });

      if (error) {
        throw new ValidationException([error.message]);
      }

      return {
        message:
          'Registration successful! Please check your email to verify your account.',
        user: data.user,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      // Sign in user with Supabase
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw new ValidationException(['Invalid email or password']);
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
