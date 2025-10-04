import { CloudinaryService } from 'module/cloudinary/services/cloudinary.service';

export const SupabaseTestProvider = {
  provide: CloudinaryService,
  useValue: {
    uploadImage: jest.fn().mockResolvedValue({
      secure_url: 'http://fake-url.com/image.png',
      secure_id: 'fake-id',
    }),
    deleteImage: jest.fn().mockResolvedValue({}),
  },
};
