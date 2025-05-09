import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR

    let message: string | string[] = 'Error interno del servidor';
    
    // Errores lanzados con HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseError = exception.getResponse();

      //   si responseObject es un objecto y tiene la propiedad message Y es un array esa propiedad message
      if (
        typeof responseError === 'object' &&
        responseError['message'] &&
        Array.isArray(responseError['message'])
      ) {
        message = responseError['message'];
      } else {
        message = exception.message;
      }
    }

    // Errores por restricciones de base de datos (PostgreSQL)
    else if (exception instanceof QueryFailedError) {
      console.log("YOOOO --> LLEGAS AQUI ")
      const error: any = exception;

      if (error.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Ya existe un registro con ese valor único';
      }

      if (error.code === '22P02') {
        status = HttpStatus.BAD_REQUEST;
        message = 'El ID proporcionado no es válido';
      }
    }

    // Estrutura personalizada
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
