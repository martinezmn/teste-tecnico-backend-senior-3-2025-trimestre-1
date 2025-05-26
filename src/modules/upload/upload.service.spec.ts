import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { UploadProducer } from '../queue/processors/upload.producer';
import { Cache } from '../../contracts/cache.abstract';
import { BadRequestException, Logger } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: () => 'uuid-mockado',
}));

describe('UploadService', () => {
  let service: UploadService;
  let uploadProducerMock: jest.Mocked<UploadProducer>;
  let cacheMock: jest.Mocked<Cache>;

  beforeEach(async () => {
    uploadProducerMock = {
      queue: jest.fn(),
    } as any;

    cacheMock = {
      set: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: UploadProducer, useValue: uploadProducerMock },
        { provide: Cache, useValue: cacheMock },
      ],
    }).compile();

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    service = module.get<UploadService>(UploadService);
  });

  it('deve aceitar e processar um upload válido', async () => {
    const mockFile = {
      originalname: 'foto.jpg',
      size: 1024 * 1024,
      buffer: Buffer.from('conteúdo da imagem'),
    } as Express.Multer.File;

    const result = await service.handleUpload(mockFile);

    expect(cacheMock.set).toHaveBeenCalledWith(
      'uuid-mockado.jpg',
      mockFile.buffer,
      60_000,
    );

    expect(uploadProducerMock.queue).toHaveBeenCalledWith({
      fileName: 'uuid-mockado.jpg',
      buffer: mockFile.buffer.toString('base64'),
    });

    expect(result).toEqual({ fileName: 'uuid-mockado.jpg' });
  });

  it('deve lançar exceção se o tipo de arquivo for inválido', async () => {
    const mockFile = {
      originalname: 'documento.pdf',
      size: 1024,
      buffer: Buffer.from('conteúdo'),
    } as Express.Multer.File;

    await expect(service.handleUpload(mockFile)).rejects.toThrow(
      BadRequestException,
    );
    expect(uploadProducerMock.queue).not.toHaveBeenCalled();
    expect(cacheMock.set).not.toHaveBeenCalled();
  });

  it('deve lançar exceção se o tamanho do arquivo exceder o limite', async () => {
    const mockFile = {
      originalname: 'grande.png',
      size: 6 * 1024 * 1024,
      buffer: Buffer.from('imagem muito grande'),
    } as Express.Multer.File;

    await expect(service.handleUpload(mockFile)).rejects.toThrow(
      BadRequestException,
    );
    expect(uploadProducerMock.queue).not.toHaveBeenCalled();
    expect(cacheMock.set).not.toHaveBeenCalled();
  });
});
