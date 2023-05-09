import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

// import { IsUserAlreadyExist } from '../decorators';
import { EmailNotRegistered, UserNameTaken } from '../decorators';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

export class CreateUserDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @NotContains(' ', {
    message: 'Username cannot contain spaces and must be unique',
  })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @UserNameTaken({ message: 'Username - $value - is already taken' })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  user_name: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @EmailNotRegistered({ message: 'User with email - $value - already exists' })
  @IsEmail(undefined, { message: 'Please provide a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long and contain a number, a lowercase letter and an uppercase letter',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty({ message: 'Link is required' })
  link: string;
}
