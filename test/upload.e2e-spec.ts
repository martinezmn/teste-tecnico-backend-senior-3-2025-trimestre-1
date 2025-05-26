import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MainModule } from '../src/main.module';
import { join } from 'path';

describe('Upload e StaticController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MainModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve fazer upload de uma imagem e servir ela pelo static endpoint', async () => {
    const testImagePath = join(__dirname, 'fixtures/valid-image.jpg');

    const uploadRes = await request(app.getHttpServer())
      .post('/upload/image')
      .attach('file', testImagePath)
      .expect(201);

    const { fileName } = uploadRes.body;
    expect(fileName).toMatch(/\.(png|jpg|jpeg|gif)$/);

    await new Promise((res) => setTimeout(res, 2000));

    const imageRes = await request(app.getHttpServer())
      .get(`/static/image/${fileName}`)
      .expect(200)
      .expect('Content-Type', /image\/(png|jpeg|gif)/);

    expect(imageRes.body).toBeInstanceOf(Buffer);
    expect(imageRes.body.length).toBeGreaterThan(100);
  });

  it('deve retornar erro ao tentar fazer upload de imagem maior que 5MB', async () => {
    const testImagePath = join(__dirname, 'fixtures/over-5mb-image.jpg');

    const uploadRes = await request(app.getHttpServer())
      .post('/upload/image')
      .attach('file', testImagePath)
      .expect(400);

    expect(uploadRes.body.message).toBe('File size exceeds the limit of 5MB');
  });

  it('deve retornar erro ao tentar fazer upload de arquivo com extensão inválida', async () => {
    const testImagePath = join(__dirname, 'fixtures/invalid-extension.pdf');

    const uploadRes = await request(app.getHttpServer())
      .post('/upload/image')
      .attach('file', testImagePath)
      .expect(400);

    expect(uploadRes.body.message).toBe(
      'Invalid file type. Only images are allowed',
    );
  });
});
