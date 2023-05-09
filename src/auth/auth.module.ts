import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IsEmailNotRegistered, IsUserNameUnique } from './decorators';
// import { IsUserAlreadyExist } from './decorators';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, IsEmailNotRegistered, IsUserNameUnique],
})
export class AuthModule {}
