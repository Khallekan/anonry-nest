import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoogleInfo, User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, GoogleInfo])],
  exports: [TypeOrmModule],
})
export class UserModule {}
