import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseService } from './supabase.service';
import { SupabaseStrategy } from './supabase.strategy';
import { SupabaseAuthGuard } from './supabse-auth.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'supabase' })], // 👈 Register passport strategy
  providers: [
    SupabaseStrategy,
    SupabaseAuthGuard,
    SupabaseService,
    AuthService,
  ],
  exports: [SupabaseAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
