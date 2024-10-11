const fs = require("fs");
const path = require("path");
const { S3 } = require("aws-sdk");

// const awsTimeConfig = { signedUrlExpirySeconds: 518400 };

// const config = {
//   aws: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     accessKeySecret: process.env.AWS_SECRET_ACCESS_ID,
//     s3Bucket: process.env.AWS_BUCKET_NAME,
//   },
// };

// const s3Config = {
//   signatureVersion: "v4",
//   // region: config.aws.region,
//   s3ForcePathStyle: true,
// };
// if (config.aws.accessKeyId && config.aws.accessKeySecret) {
//   s3Config.accessKeyId = config.aws.accessKeyId;
//   s3Config.secretAccessKey = config.aws.accessKeySecret;
// }
// const s3 = new S3(s3Config);

// exports.uploadFileThroughStream = (
//   fileBuffer,
//   uuid,
//   fileName,
//   fileExt,
//   bucket
// ) => {
//   const sanitized = fileName.replace(/[^A-Za-z0-9]/gi, "_").toLowerCase();
//   const fileKey = `${uuid}-${sanitized}${fileExt}`;
//   const params = {
//     Bucket: `${config.aws.s3Bucket}/${bucket}`,
//     Key: fileKey,
//     Body: fileBuffer,
//   };

//   return s3.upload(params).promise();
// };

exports.getPreSignedUrl = async (
  key,
  expireInSeconds = awsTimeConfig.signedUrlExpirySeconds
) => {
  if (!key) {
    return;
  }
  const fileExtension = key.split(".").pop();

  return s3
    .getSignedUrlPromise("getObject", {
      Bucket: `${config.aws.s3Bucket}`,
      Key: key,
      Expires: expireInSeconds,
    })
    .then(
      (signedUrl) =>
        `${signedUrl}&response-content-disposition=inline;filename=${encodeURIComponent(
          key
        )}`
    );
};

const awsTimeConfig = { signedUrlExpirySeconds: 518400 };

const config = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    accessKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_BUCKET_NAME,
    accessPoint: process.env.AWS_ACCESS_POINT,
  },
};

const s3Config = {
  signatureVersion: "v4",
  // region: config.aws.region,
  s3ForcePathStyle: true,
};

if (config.aws.accessKeyId && config.aws.accessKeySecret) {
  s3Config.accessKeyId = config.aws.accessKeyId;
  s3Config.secretAccessKey = config.aws.accessKeySecret;
}

const s3 = new S3(s3Config);

exports.uploadFileThroughStream = (
  fileBuffer,
  uuid,
  fileName,
  fileExt,
  bucket,
  mimetype
) => {
  const sanitized = fileName.replace(/[^A-Za-z0-9]/gi, "_").toLowerCase();
  const fileKey = `${uuid}-${sanitized}${fileExt}`;
  const params = {
    Bucket: `${config.aws.s3Bucket}/${bucket}`,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: `${mimetype}`,
    ContentDisposition: `inline; filename=${fileName}.${fileExt}`,
    ACL: "public-read",
  };

  return s3.upload(params).promise();
};

exports.getPublicImageUrl = (key) => {
  if (!key) {
    return;
  }
  return `https://${config.aws.s3Bucket}.s3.${config.aws.accessPoint}.amazonaws.com/${key}`;
};

// exports.getPreSignedUrl = async (
//   key,
//   expireInSeconds = awsTimeConfig.signedUrlExpirySeconds
// ) => {
//   if (!key) {
//     return;
//   }
//   return s3.getSignedUrlPromise("getObject", {
//     Bucket: config.aws.s3Bucket,
//     Key: key,
//     Expires: expireInSeconds,
//   });
// };
