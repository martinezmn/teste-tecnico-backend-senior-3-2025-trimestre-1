import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;

  beforeEach(async () => {
    const mockUploadService = {
      handleUpload: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);
  });

  it('deve chamar o serviço de upload com o arquivo recebido', async () => {
    const mockFile = {
      originalname: 'imagem.jpg',
      buffer: Buffer.from('conteúdo da imagem'),
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const resultadoEsperado = { message: 'Upload realizado com sucesso' };
    (uploadService.handleUpload as jest.Mock).mockResolvedValue(
      resultadoEsperado,
    );

    const resultado = await controller.upload(mockFile);

    expect(uploadService.handleUpload).toHaveBeenCalledWith(mockFile);
    expect(resultado).toEqual(resultadoEsperado);
  });
});
