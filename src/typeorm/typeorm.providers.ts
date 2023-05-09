import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Environment } from 'src/configuration';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('POSTGRES_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('POSTGRES_PASSWORD'),
      logger: 'advanced-console',
      logging: true,
      synchronize:
        this.config.get<string>('NODE_ENV') === Environment.Development ||
        this.config.get<string>('NODE_ENV') === Environment.Test, // never use TRUE in production!
      retryAttempts: 1,
      autoLoadEntities: true,
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
    };
  }
}
