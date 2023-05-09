import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const exceptionFactory = (validationErrors: ValidationError[] = []) => {
  return new BadRequestException(
    validationErrors[0].constraints
      ? validationErrors[0].constraints[
          Object.keys(validationErrors[0].constraints)[0]
        ]
      : 'Omo how did you reach here',
  );
};
