import { Readable } from 'stream';

export const fakeImage: Express.Multer.File = {
  fieldname: 'image',
  originalname: 'fake-image.png',
  encoding: 'utf-8',
  mimetype: 'image/png',
  buffer: Buffer.from('fake-image'),
  size: 1234,
  stream: new Readable(),
  destination: '',
  filename: '',
  path: '',
};
