import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import Message from './message.entity';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import Chat from './chat.entity';

class AddMember {
  @ApiProperty({
    example: [1],
    description: 'List of user`s id who you wanna add to member`s list',
  })
  users: number[];
  @ApiProperty({ example: 1, description: 'Chat id' })
  chatId: number;
}

class RemoveMember {
  @ApiProperty({
    example: 1,
    description: 'User id who you wanna remove from member`s list',
  })
  userId: number;
  @ApiProperty({ example: 1, description: 'Chat id' })
  chatId: number;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  async getChat(@Param('chatId') chatId: number) {
    return await this.chatService.getChat(chatId);
  }

  @Post()
  async createChat(@Body() chat: Chat) {
    return await this.chatService.createChat(chat);
  }

  @Patch('members')
  @ApiBody({ type: AddMember })
  async addMemberToChat(@Body() { users, chatId }: AddMember) {
    await users.forEach(async (elem) => {
      await this.chatService.addMember(elem, chatId);
    });
    return await this.chatService.getChatMembers(chatId);
  }

  @Delete('members')
  @ApiBody({ type: RemoveMember })
  async removeMemberFromChat(@Body() { userId, chatId }: RemoveMember) {
    return await this.chatService.removeMember(userId, chatId);
  }

  @Delete(':chatId')
  async deleteChat(@Param('chatId') chatId: string) {
    this.chatService.removeChat(+chatId);
  }

  @Post('message/')
  @ApiBody({ type: Message })
  async createChatMessage(@Body() message: Message) {
    const dbMessage = await this.chatService.createMessage(message);

    return await this.chatService.addMessageToChat(dbMessage);
  }

  @Patch('message/:messageId')
  @ApiBody({ type: Message })
  async editMessage(
    @Param('messageId') messageId: string,
    @Body() message: Message,
  ) {
    return await this.chatService.updateMessage(+messageId, message);
  }

  @Delete('message/:messageId')
  async removeMessage(@Param('messageId') messageId: string) {
    return await this.chatService.deleteMessage(+messageId);
  }
}
