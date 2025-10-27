import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../../config/configuration.module';
import { DatabaseModule } from '../database/database.module';
import { SupabaseAuthGuard } from './infrastructure/guard/supabase-auth.guard';
import { AuthService } from './infrastructure/services/auth.service';
import { AuthController } from './presentation/api/auth.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseAuthGuard],
  exports: [AuthService, JwtModule, SupabaseAuthGuard],
})
export class AuthModule {}
