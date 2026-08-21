import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get('HOST_DB'),
          password: config.get('PASSWORD_DB'),
          port: 3306,
          type: 'mysql',
          database: config.get('DATABASE_DB'),
          username: config.get('USERNAME_DB'),
          synchronize: false,
          autoLoadEntities: false,
          entities: [__dirname + '/../**/*.entity.ts'],
        };
      },
    }),
  ],
})
export class DatabaseConfigModule {}
