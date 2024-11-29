import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import User from 'src/users/users.entity';

export default class CreateChatDto {
  @ApiProperty({
    example: 'Group',
    description: 'Group name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'List of users',
    example: [],
  })
  @IsArray()
  @IsInt({ each: true })
  members: User[];
}
