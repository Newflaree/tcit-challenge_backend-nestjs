import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';

describe('HttpExceptionFilter - errores inesperados', () => {
  function makeHost(response: { status: jest.Mock; json: jest.Mock }) {
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;
    return host;
  }

  it('oculta detalles en errores inesperados (500)', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = makeHost(response);
    const filter = new HttpExceptionFilter();

    filter.catch(new Error('boom sql'), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Error interno del servidor',
      error: 'Internal Server Error',
    });
  });

  it('oculta detalles cuando el error no es una instancia de Error', () => {
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const host = makeHost(response);
    const filter = new HttpExceptionFilter();

    filter.catch('boom', host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Error interno del servidor',
      error: 'Internal Server Error',
    });
  });
});
