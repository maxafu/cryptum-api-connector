import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class CryptumExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    let message = exception.message;
    if (exception.getResponse) {
      const response = exception.getResponse() as any;
      message = Array.isArray(response.message) ? response.message[0] : response.message;
    }

    reply.code(400).send({
      statusCode: reply.statusCode,
      message,
      error: exception.name,
    });
  }
}
