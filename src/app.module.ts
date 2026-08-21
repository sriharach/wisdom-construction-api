import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GlobalExceptionFilter } from './helper/errors.interceptor';
import { DatabaseConfigModule } from './database/config.module';
import { RoleModule } from './roles/roles.module';
import { RealtysModule } from './realtys/realtys.module';
import { CategoriesHouseModule } from './categoriesHouse/categoriesHouse.module';
import { ModelHouseModule } from './modelHouse/modelHouse.module';
import { UploadModule } from './upload/upload.module';
import { DatabaseConfigAWSModule } from './database/config.module.aws';

@Module({
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    // MulterModule.registerAsync({
    //   imports: [ConfigModule, UploadModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     // dest: configService.get<string>('MULTER_DEST'),
    //     storage: diskStorage({
    //       destination: './public/uploads',
    //       filename: (req, file, cb) => {
    //         const filename = `${Date.now()}-${file.originalname}`;
    //         console.log('filename :>> ', filename);
    //         cb(null, filename);
    //       },
    //     }),
    //   }),
    //   inject: [ConfigService],
    // }),
    DatabaseConfigAWSModule,
    AuthModule,
    UsersModule,
    RoleModule,
    RealtysModule,
    CategoriesHouseModule,
    ModelHouseModule,
    UploadModule,
  ],
})
export class AppModule {}
