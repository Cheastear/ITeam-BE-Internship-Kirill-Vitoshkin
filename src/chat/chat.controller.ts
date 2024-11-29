import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import CreateChatDto from 'src/dto/create-chat.dto';
import { CreateMessageDto } from 'src/dto/create-message.dto';
import CreateMemberDto from 'src/dto/create-member.dto';
import CreateRemoveMemberDto from 'src/dto/create-remove-member.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Chat with this id is not exist' })
  async getChat(@Param('chatId') chatId: number) {
    return await this.chatService.getChat(chatId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({
    status: 400,
    description: 'User with this id is not exist',
  })
  @ApiResponse({
    status: 400,
    description: `User with this id already in that chat`,
  })
  async createChat(@Body() chat: CreateChatDto) {
    return await this.chatService.createChat(chat);
  }

  @Patch('members')
  @ApiBody({ type: CreateMemberDto })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({
    status: 400,
    description: 'User with this id is not exist',
  })
  @ApiResponse({
    status: 400,
    description: `User with this id already in that chat`,
  })
  async addMemberToChat(@Body() { users, chatId }: CreateMemberDto) {
    await users.forEach(async (elem) => {
      await this.chatService.addMember(elem, chatId);
    });
    return await this.chatService.getChat(chatId);
  }

  @Delete('members')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({ type: CreateRemoveMemberDto })
  @ApiResponse({ status: 204 })
  @ApiResponse({
    status: 400,
    description: 'This user is already removed from this chat',
  })
  @ApiResponse({
    status: 400,
    description: 'Chat with this id is not exist',
  })
  async removeMemberFromChat(
    @Body() { userId, chatId }: CreateRemoveMemberDto,
  ) {
    return await this.chatService.removeMember(userId, chatId);
  }

  @Delete(':chatId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204 })
  @ApiResponse({
    status: 400,
    description: `Chat with this id in not exitst`,
  })
  async deleteChat(@Param('chatId') chatId: string) {
    await this.chatService.removeChat(+chatId);
  }

  @Post('message/')
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({ status: 201, description: 'Message created' })
  async createChatMessage(@Body() message: CreateMessageDto) {
    if (
      !(await this.chatService.isUserInMembers({
        userId: +message.user,
        chatId: +message.chat,
      }))
    )
      throw new BadRequestException('This user is not in members of this chat');

    const dbMessage = await this.chatService.createMessage(message);

    return await this.chatService.addMessageToChat(dbMessage);
  }

  @Patch('message/:messageId')
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 400,
    description: `Message with this id is not exist`,
  })
  async editMessage(
    @Param('messageId') messageId: string,
    @Body() message: Partial<CreateMessageDto>,
  ) {
    return await this.chatService.updateMessage(+messageId, message);
  }

  @Delete('message/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Ok' })
  @ApiResponse({
    status: 400,
    description: 'Message with this ida is not exist',
  })
  async removeMessage(@Param('messageId') messageId: string) {
    return await this.chatService.deleteMessage(+messageId);
  }
}
