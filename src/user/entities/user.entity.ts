import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  NotContains,
  Validate,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user',
}

enum STATUS {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
  TAKENDOWN = 'takendown',
}

export type AvatarString = `https://robohash.org/${string}`;

@ValidatorConstraint({ name: 'valid avatar', async: false })
export class AvatarValidator implements ValidatorConstraintInterface {
  public validate(text: string) {
    return text.startsWith('https://robohash.org/');
  }

  public defaultMessage() {
    return 'Please provide a valid avatar';
  }
}

@Entity({ name: 'google_info' })
export class GoogleInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ type: 'varchar', nullable: false })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  google_id: string;

  @Column({ nullable: false })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ nullable: false })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform((param) => (param.value as string).toLowerCase())
  email: string;

  @OneToOne(() => User, (user) => user.google)
  user: Relation<User>;
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn({ nullable: false, type: 'varchar', unique: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Provide valid email' })
  @Transform((param) => (param.value as string).toLowerCase())
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => GoogleInfo, (google) => google.user)
  @JoinColumn()
  google: Relation<GoogleInfo>;

  @Column({ nullable: true, unique: true })
  @Transform((param) => param.value.toLowerCase())
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @NotContains(' ', {
    message: 'Username cannot contain spaces and must be unique',
  })
  user_name: string;

  @Column({ nullable: false, type: 'enum', enum: ROLES })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;

  @Column({ nullable: false })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Validate(AvatarValidator)
  avatar: AvatarString;

  @Column({ nullable: false, type: 'boolean', default: false })
  @IsBoolean()
  verified: boolean;

  @Column({
    nullable: false,
    type: 'enum',
    enum: STATUS,
    default: STATUS.UNVERIFIED,
  })
  @IsEnum(STATUS)
  status: STATUS;

  @Column({ nullable: true, type: 'varchar' })
  otpToken: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  deleted: boolean;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;
}
