import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthenticationModule, ConfigModule.forRoot()],
})
export class AppModule {}
