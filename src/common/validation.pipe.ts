import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';

import { ValidationException } from './validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true, // Throws error if unknown properties exist
      transform: true, // Automatically transforms request payloads
    });

    if (errors.length > 0) {
      const formatted_messages = errors.map((error_info) => {
        const all_constraints = Object.keys(error_info.constraints).map(
          (constraint_key) => error_info.constraints[constraint_key],
        );
        return all_constraints;
      });
      throw new ValidationException(_.flatten(formatted_messages));
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
