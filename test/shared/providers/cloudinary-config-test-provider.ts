import { CloudinaryService } from './../../../src/module/cloudinary/services/cloudinary.service';

export const CloudinaryTestProvider = {
  provide: CloudinaryService,
  useValue: {
    uploadImage: jest.fn().mockResolvedValue({
      secure_url: 'http://fake-url.com/image.png',
      secure_id: 'fake-id',
    }),
    deleteImage: jest.fn().mockResolvedValue({}),
  },
};
