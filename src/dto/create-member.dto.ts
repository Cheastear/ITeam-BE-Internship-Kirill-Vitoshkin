import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export default class CreateMemberDto {
  @ApiProperty({
    example: [1],
    description: 'List of user`s id who you wanna add to member`s list',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  users: number[];

  @ApiProperty({ example: 1, description: 'Chat id' })
  @IsInt()
  @IsNotEmpty()
  chatId: number;
}
