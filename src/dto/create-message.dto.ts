import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import Chat from 'src/chat/chat.entity';
import User from 'src/users/users.entity';

export class CreateMessageDto {
  @IsString()
  @ApiProperty({ example: 'Message for somebody', description: 'Message' })
  content: string;

  user: User;

  @IsInt()
  @ApiProperty({
    type: () => Chat,
    example: 1,
    description: 'The chat the message belongs to. Send only chat id',
  })
  chat: Chat;
}
