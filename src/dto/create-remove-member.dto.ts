import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export default class CreateRemoveMemberDto {
  @ApiProperty({
    example: 1,
    description: 'User id who you wanna remove from member`s list',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1, description: 'Chat id' })
  @IsInt()
  @IsNotEmpty()
  chatId: number;
}
