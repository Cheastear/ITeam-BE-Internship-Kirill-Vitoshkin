import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class GetMessageDto {
  @ApiProperty({ description: 'Message id what you recived last (default 0)' })
  @IsNumber()
  @IsNotEmpty()
  messageId: number;

  @ApiProperty({ description: 'Chat id where from you wanna recive messages' })
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}
