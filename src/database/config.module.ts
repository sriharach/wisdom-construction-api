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
          port: Number(config.get('PORT_DB')) || 5432,
          type: 'postgres',
          database: config.get('DATABASE_DB'),
          username: config.get('USERNAME_DB'),
          synchronize: false,
          autoLoadEntities: true,
          entities: [__dirname + '/../**/*.entity.ts'],
        };
      },
    }),
  ],
})
export class DatabaseConfigModule {}
