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

@ValidatorConstraint({ async: true, name: 'isUserNameUnique' })
export class IsUserNameUnique implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    protected userRepository: Repository<User>,
  ) {}
  async validate(value: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { user_name: value },
    });

    return !user;
  }
  defaultMessage?(
    validationArguments?: ValidationArguments | undefined,
  ): string {
    throw new BadRequestException(
      `${validationArguments?.value || 'Username'} is already taken`,
    );
  }
}

export function UserNameTaken(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserNameUnique,
    });
  };
}
