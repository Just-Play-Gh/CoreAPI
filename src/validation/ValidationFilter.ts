import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class ValidationFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      console.log(exception.getStatus().toString(), exception.getResponse());
    }
  }
}
