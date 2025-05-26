import { Test, TestingModule } from '@nestjs/testing';
import { UploadProcessor } from './upload.processor';
import { FileUpload } from '../../../contracts/file-upload.abstract';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

describe('UploadProcessor', () => {
  let processor: UploadProcessor;
  let fileUploadMock: jest.Mocked<FileUpload>;
  let jobMock: Partial<Job<{ fileName: string; buffer: string }>>;

  beforeEach(async () => {
    fileUploadMock = {
      uploadFile: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadProcessor,
        {
          provide: FileUpload,
          useValue: fileUploadMock,
        },
      ],
    }).compile();

    processor = module.get<UploadProcessor>(UploadProcessor);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

    jobMock = {
      data: {
        fileName: 'test.jpg',
        buffer: Buffer.from('conteúdo da imagem').toString('base64'),
      },
      moveToCompleted: jest.fn(),
      moveToFailed: jest.fn(),
      id: '123',
    };
  });

  it('deve fazer upload do arquivo e mover o job para completado', async () => {
    fileUploadMock.uploadFile.mockResolvedValue(undefined);
    (jobMock.moveToCompleted as jest.Mock).mockResolvedValue(undefined);

    await processor.handleUpload(jobMock as Job);

    expect(fileUploadMock.uploadFile).toHaveBeenCalledWith(
      'images',
      'test.jpg',
      expect.any(Buffer),
    );
    expect(jobMock.moveToCompleted).toHaveBeenCalledWith('123', true);
    expect(Logger.prototype.log).toHaveBeenCalledWith(
      'File test.jpg uploaded successfully to bucket images.',
    );
  });

  it('deve registrar erro e mover o job para falha se upload lançar exceção', async () => {
    const erro = new Error('Falha no upload');
    fileUploadMock.uploadFile.mockRejectedValue(erro);
    (jobMock.moveToFailed as jest.Mock).mockResolvedValue(undefined);

    await processor.handleUpload(jobMock as Job);

    expect(fileUploadMock.uploadFile).toHaveBeenCalled();
    expect(jobMock.moveToFailed).toHaveBeenCalledWith(erro, true);
    expect(Logger.prototype.error).toHaveBeenCalledWith(erro);
  });
});
