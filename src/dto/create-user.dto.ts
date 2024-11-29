import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export default class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description: 'User chosen display name',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address for account',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Hashed password for security',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Nolan',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: new Date('11.01.2011'),
    description: 'User date of birth',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    example: '+1(234)56789012',
    description: 'User contact phone number',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'st.first 21s',
    description: 'User physical address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'user',
    description: 'User role (e.g., admin, user, moderator)',
  })
  @IsIn(['admin', 'user', 'moderator'])
  @IsNotEmpty()
  role: 'admin' | 'user' | 'moderator';

  @ApiProperty({
    example: '',
    description: 'URL or path to users profile picture',
  })
  @ValidateIf((object, value) => value === '' || value)
  @IsString()
  profilePicture: string;

  @ApiProperty({
    example: 'Biography',
    description: 'Short biography or description of the user',
  })
  @IsString()
  @IsNotEmpty()
  bio: string;
}
