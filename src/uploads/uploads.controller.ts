import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'kimchieat1424'; ///unique한 name이어야함.

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: 'AKIAUDWXLVGIPGS4Y74F',
        secretAccessKey: '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',
      },
    });
    try {
      const objectName = `${Date.now() + file.originalname}`;
      await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
        })
        .promise();
      const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url: fileUrl };
    } catch (e) {
      console.log(e);
      return null;
      console.log(e);
    }
  }
}

// try{
//   const upload = await new AWS.S3()
//     .putObject({
//       Body:file.buffer,
//       Bucket:BUCKET_NAME,
//       key:`${Date.now()+file.originalname}`
//     })
//     .promise();
//     console.log(upload)
// }
