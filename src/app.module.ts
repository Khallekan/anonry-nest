import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config, validate } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validate,
    }),
  ],
})
export class AppModule {}
