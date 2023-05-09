import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarString, ROLES, User } from 'src/user/entities';
import { Repository, TypeORMError } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDto: CreateUserDto) {
    try {
      const randomNumber = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
      const avatar: AvatarString = `https://robohash.org/${userDto.user_name}?set=${randomNumber}&size=500x500`;
      await this.userRepository.save({
        ...userDto,
        role: ROLES.USER,
        avatar,
      });
      return {
        data: {
          status: HttpStatus.OK,
          message: 'OTP has been sent to your email',
        },
      };
    } catch (err: unknown) {
      if (err instanceof TypeORMError) {
        // console.log({ err });

        throw new BadRequestException(err.message);
      }

      // console.log({ err });
    }
  }
  // findAll() {
  //   return `This action returns all auth`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }
  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
