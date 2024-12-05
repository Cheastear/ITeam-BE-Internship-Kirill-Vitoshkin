import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';
import { CreateMessageDto } from 'src/dto/create-message.dto';
import { MessageService } from './message.service';
import GetMessageDto from 'src/dto/get-message-dto';
import { ChatService } from '../chat.service';

@Controller('chat/message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetMessageDto })
  async getMessagesFromId(@Request() req, @Body() body: GetMessageDto) {
    if (
      !(await this.chatService.isUserInMembers({
        chatId: body.chatId,
        userId: req.user.id,
      }))
    )
      throw new UnauthorizedException();

    return await this.messageService.getMessagesFromId(
      body.messageId,
      body.chatId,
    );
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'Message created' })
  async createChatMessage(@Request() req, @Body() message: CreateMessageDto) {
    message.user = req.user.id;

    const dbMessage = await this.messageService.createMessage(message);

    return await this.messageService.addMessageToChat(dbMessage);
  }

  @Patch(':messageId')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 400,
    description: `Message with this id is not exist`,
  })
  async editMessage(
    @Request() req,
    @Param('messageId') messageId: string,
    @Body() message: Partial<CreateMessageDto>,
  ) {
    if (!(await this.messageService.isMessageInUser(req.user.id, +messageId)))
      throw new UnauthorizedException();
    return await this.messageService.updateMessage(+messageId, message);
  }

  @Delete(':messageId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Ok' })
  @ApiResponse({
    status: 400,
    description: 'Message with this ida is not exist',
  })
  async removeMessage(@Request() req, @Param('messageId') messageId: string) {
    if (!(await this.messageService.isMessageInUser(req.user.id, +messageId)))
      throw new UnauthorizedException();
    return await this.messageService.deleteMessage(+messageId);
  }
}
