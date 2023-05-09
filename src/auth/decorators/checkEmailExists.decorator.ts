import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true, name: 'isEmailNotRegistered' })
export class IsEmailNotRegistered implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validate(email: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: email }, { google: { email: email } }],
    });
    return !user;
  }

  defaultMessage(
    validationArguments?: ValidationArguments | undefined,
  ): string {
    throw new BadRequestException(
      `User with email - ${validationArguments?.value} - already exists`,
    );
  }
}

export function EmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotRegistered,
    });
  };
}
