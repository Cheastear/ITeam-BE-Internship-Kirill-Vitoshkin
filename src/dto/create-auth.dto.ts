import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateAuthDto {
  @ApiProperty({ example: 'user', description: 'Username for auth' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Password from accaunt you created with this username',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
