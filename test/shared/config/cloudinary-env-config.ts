export const configureCloudinaryEnv = () => {
  process.env.CLOUDINARY_CLOUD_NAME = 'fake-cloud-name';
  process.env.CLOUDINARY_API_KEY = 'fake-api-key';
  process.env.CLOUDINARY_API_SECRET = 'fake-api-secret';
};
