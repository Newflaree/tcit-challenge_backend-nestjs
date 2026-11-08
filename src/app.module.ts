import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { validateEnv } from './config/env.validation';
import {
  createTypeOrmDataSource,
  createTypeOrmOptions,
} from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmOptions,
      dataSourceFactory: createTypeOrmDataSource,
    }),
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
