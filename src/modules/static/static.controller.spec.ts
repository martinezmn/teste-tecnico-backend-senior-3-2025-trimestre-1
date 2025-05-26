import { Test, TestingModule } from '@nestjs/testing';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

jest.mock('mime-types', () => ({
  lookup: jest.fn().mockReturnValue('image/jpeg'),
}));

describe('StaticController', () => {
  let controller: StaticController;
  let service: StaticService;
  let res: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticController],
      providers: [
        {
          provide: StaticService,
          useValue: {
            getFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaticController>(StaticController);
    service = module.get<StaticService>(StaticService);

    res = {
      setHeader: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('deve retornar o arquivo e definir o Content-Type corretamente', async () => {
    const mockBuffer = Buffer.from('fake image data');
    (service.getFile as jest.Mock).mockResolvedValue(mockBuffer);

    await controller.get('imagem.jpg', res as Response);

    expect(service.getFile).toHaveBeenCalledWith('imagem.jpg');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/jpeg');
    expect(res.send).toHaveBeenCalledWith(mockBuffer);
  });

  it('deve retornar 404 se o arquivo não for encontrado', async () => {
    (service.getFile as jest.Mock).mockResolvedValue(null);

    await controller.get('inexistente.jpg', res as Response);

    expect(service.getFile).toHaveBeenCalledWith('inexistente.jpg');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal server error');
  });

  it('deve tratar erros inesperados e retornar status 500', async () => {
    const error = new Error('Erro inesperado');
    (service.getFile as jest.Mock).mockRejectedValue(error);

    await controller.get('qualquer.jpg', res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Internal server error');
  });
});
