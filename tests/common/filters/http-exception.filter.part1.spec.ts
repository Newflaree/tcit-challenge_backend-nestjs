import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('HttpExceptionFilter', () => {
  function makeHost(response: { status: jest.Mock; json: jest.Mock }) {
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;
    return host;
  }

  it('normaliza una HttpException con body objeto', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = makeHost(response);
    const filter = new HttpExceptionFilter();

    filter.catch(
      new HttpException(
        { statusCode: 400, message: 'Bad request', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      ),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Bad request',
      error: 'Bad Request',
    });
  });

  it('usa el mensaje string cuando la respuesta es string', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = makeHost(response);
    const filter = new HttpExceptionFilter();

    filter.catch(new HttpException('Not found', HttpStatus.NOT_FOUND), host);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Not found',
      error: 'Internal Server Error',
    });
  });

  it('mantiene valores por defecto cuando el body no trae message ni error', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = makeHost(response);
    const filter = new HttpExceptionFilter();

    filter.catch(new HttpException({}, HttpStatus.BAD_REQUEST), host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Error interno del servidor',
      error: 'Internal Server Error',
    });
  });

  it('ignora un exceptionResponse nulo', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = makeHost(response);
    const filter = new HttpExceptionFilter();

    filter.catch(
      new HttpException(null as unknown as string, HttpStatus.BAD_REQUEST),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Error interno del servidor',
      error: 'Internal Server Error',
    });
  });
});
