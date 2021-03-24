import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import slugify from 'slugify';

import { AppError } from '../errors';

const acceptablesImgType = ['jpeg', 'png', 'gif'];

class UploadS3Service {
    s3: AWS.S3;

    bucketName: string;

    constructor() {
      this.bucketName = process.env.AWS_BUCKET_NAME;

      this.s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_DEFAULT_REGION,
      });
    }

    uploadImageBase64(file: string, folderName: string, fileName: string = null) {
      const base64Data = new Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ''), 'base64',
      );
      const type = file.split(';')[0].split('/')[1];

      this.validateTypeFiles(type, acceptablesImgType);

      let tratedFileName = fileName || `${uuid()}.${type}`;
      tratedFileName = slugify(tratedFileName, {
        replacement: '_',
        lower: true,
      });

      const tratedFolderName = slugify(folderName, {
        replacement: '_',
        lower: true,
      });

      const params = {
        Bucket: `${this.bucketName}/images/${tratedFolderName}`,
        Key: tratedFileName,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: `image/${type}`, // required. Notice the back ticks
      };

      return this.s3.upload(params).promise()
        .then((data) => data)
        .catch((err) => {
          console.warn('UPLOAD IMAGE FAILED', err);
          throw err;
        });
    }

    async deleteFile(fileUrl: string) {
      const params = {
        Bucket: this.bucketName,
        Key: fileUrl,
      };

      return this.s3.deleteObject(params).promise()
        .then((data) => data)
        .catch((err) => {
          console.warn('DELETE FILE FAILED', err);
          throw err;
        });
    }

    private validateTypeFiles = (type, acceptables = []) => {
      if (!acceptables.includes(type)) {
        throw new AppError(
          `${type} is not accept file type. Acceptables: ${acceptables}`,
          400,
        );
      }
    }
}

export {
  UploadS3Service,
};
