import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domains/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './domains/auth/guards/jwt-auth.guard';
import { UsersModule } from './domains/users/users.module';
import { DatabaseModule } from './common/database/database.module';
import { RoleGuard } from './domains/auth/guards/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
