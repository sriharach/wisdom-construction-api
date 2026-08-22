import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createAuroraDsqlOptions } from './aurora-dsql.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          ...createAuroraDsqlOptions({
            PGHOST: config.get<string>('PGHOST'),
            PGPORT: config.get<string>('PGPORT'),
            PGUSER: config.get<string>('PGUSER'),
            PGDATABASE: config.get<string>('PGDATABASE'),
            PGSSLMODE: config.get<string>('PGSSLMODE'),
          }),
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseConfigAWSModule {}
