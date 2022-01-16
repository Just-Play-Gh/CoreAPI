import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AWSS3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_KEY_SECRET,
  });

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-west-1',
      },
    };

    console.log(params);

    try {
      const s3Response = await this.s3.upload(params).promise();
      console.log(s3Response);
      return s3Response.Location;
    } catch (e) {
      console.log(e);
      // return false;
    }
  }
}
