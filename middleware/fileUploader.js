const awsS3Service = require("../services/s3Service");
const uuid = require("uuid");
const path = require("path");
const ErrorHandler = require("../utils/ErrorHandler");
const { S3BUCKET_FOLDERS } = require("../constants");
const catchAsync = require("../utils/catchAsync");

exports.uploadImageFunction = catchAsync(async (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    return next();
  }
  // const imageArray = req.files['image'];
  // if (!imageArray) {
  //   return next();
  // }

  const image = req.file;
  console.log("`1`", image);

  const fileBuffer = image.buffer;
  const fileName = path.parse(image.originalname).name;
  const fileExt = path.parse(image.originalname).ext;
  const fileId = uuid.v4();
  const bucket = S3BUCKET_FOLDERS.KAYTREE;
  const mimetype = image.mimetype;

  const uploadPromises = [
    awsS3Service.uploadFileThroughStream(
      fileBuffer,
      fileId,
      fileName,
      fileExt,
      bucket,
      mimetype
    ),
  ];

  const uploadedFiles = await Promise.all(uploadPromises);

  if (uploadedFiles && uploadedFiles.length > 0) {
    // const profileURL = await awsS3Service.getPreSignedUrl(uploadedFiles[0].Key);
    const imageURL = await awsS3Service.getPublicImageUrl(uploadedFiles[0].Key);

    req.imageURL = imageURL;
    req.imageKey = uploadedFiles[0].Key;
    next();
  }
});
