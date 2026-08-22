import { directionPath } from '@/utils/directionPath';
import { getRandomUniqueNumbersUsingFilter } from '@/utils/rendomUnique';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Body,
  Get,
  Param,
  Response,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { Response as TResponse } from 'express';

// @UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private configService: ConfigService) {}

  @Get('file/:file_name')
  GetFile(@Param('file_name') file_name: string, @Response() res: TResponse) {
    const imagePath = path.join(process.cwd(), 'public', file_name);
    return res.send(imagePath);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Body('code_house') code_house: string, // Get 'code_house' as a string from form-data
    @Body('code_categoires') code_categoires: string,
  ) {
    // validate file size
    const parseFiile = new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize:
            this.configService.get<number>('LIMIT_SIZE_UPLOAD') * 1024 * 1024,
        }),
      ],
    });
    await parseFiile.transform(file);

    const configPrefixFileName = !!code_house
      ? this.configService.get('PREFIX_NAME_FILE')
      : this.configService.get('PREFIX_NAME_PATH_NAME_CATEGORY');

    const eachCodeHouse = directionPath(code_house || code_categoires);
    const changeFilename = `${configPrefixFileName}-${getRandomUniqueNumbersUsingFilter(1, 90, 5).join('')}.webp`;
    const filePath = path.join(eachCodeHouse, changeFilename);

    // resize
    const resizeBuffer = await sharp(file.buffer)
      .rotate()
      .webp({ quality: 70 }) // ปรับคุณภาพตามต้องการ
      .withMetadata() // ไม่ใส่ EXIF กลับไป
      .toBuffer();

    return new Promise((resolve, reject) => {
      // Create write stream
      const writeStream = fs.createWriteStream(filePath);

      writeStream.write(resizeBuffer);
      writeStream.end();

      writeStream.on('finish', () =>
        resolve({
          file_name: changeFilename,
          path_name: `/${code_house}/${changeFilename}`,
        }),
      );
      writeStream.on('error', (err) => reject(err));
    });
  }
}
