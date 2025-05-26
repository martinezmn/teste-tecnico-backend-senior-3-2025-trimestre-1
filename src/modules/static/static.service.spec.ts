import { Test, TestingModule } from '@nestjs/testing';
import { StaticService } from './static.service';
import { FileUpload } from '../../contracts/file-upload.abstract';
import { Cache } from '../../contracts/cache.abstract';
import { Logger } from '@nestjs/common';

describe('StaticService', () => {
  let service: StaticService;
  let cacheMock: jest.Mocked<Cache>;
  let fileUploadMock: jest.Mocked<FileUpload>;

  beforeEach(async () => {
    cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    fileUploadMock = {
      getFile: jest.fn(),
      uploadFile: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaticService,
        { provide: Cache, useValue: cacheMock },
        { provide: FileUpload, useValue: fileUploadMock },
      ],
    }).compile();

    service = module.get<StaticService>(StaticService);
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('deve retornar o arquivo do cache se estiver presente', async () => {
    const buffer = Buffer.from('imagem em cache');
    cacheMock.get.mockResolvedValue(buffer);

    const result = await service.getFile('imagem.jpg');

    expect(result).toBe(buffer);
    expect(cacheMock.get).toHaveBeenCalledWith('imagem.jpg');
    expect(fileUploadMock.getFile).not.toHaveBeenCalled();
  });

  it('deve buscar do armazenamento e armazenar no cache se não estiver em cache', async () => {
    const buffer = Buffer.from('imagem do storage');
    cacheMock.get.mockResolvedValue(null);
    fileUploadMock.getFile.mockResolvedValue(buffer);

    const result = await service.getFile('imagem.jpg');

    expect(cacheMock.get).toHaveBeenCalledWith('imagem.jpg');
    expect(fileUploadMock.getFile).toHaveBeenCalledWith('images', 'imagem.jpg');
    expect(cacheMock.set).toHaveBeenCalledWith('imagem.jpg', buffer, 60_000);
    expect(result).toBe(buffer);
  });

  it('deve retornar null e registrar erro se houver falha ao obter o arquivo', async () => {
    const error = new Error('Erro ao buscar do storage');
    cacheMock.get.mockResolvedValue(null);
    fileUploadMock.getFile.mockRejectedValue(error);

    const result = await service.getFile('imagem.jpg');

    expect(result).toBeNull();
    expect(Logger.prototype.error).toHaveBeenCalledWith(error);
  });
});
