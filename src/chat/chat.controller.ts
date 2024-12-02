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
import { ChatService } from './chat.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import CreateChatDto from 'src/dto/create-chat.dto';
import CreateMemberDto from 'src/dto/create-member.dto';
import CreateRemoveMemberDto from 'src/dto/create-remove-member.dto';
import JwtAuthGuard from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatId')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Chat with this id is not exist' })
  async getChat(@Request() req, @Param('chatId') chatId: number) {
    if (
      !(await this.chatService.isUserInMembers({
        chatId: chatId,
        userId: req.user.id,
      }))
    )
      throw new UnauthorizedException();

    return await this.chatService.getChat(chatId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  async createChat(@Request() req, @Body() chat: CreateChatDto) {
    if ((await chat.members.findIndex((elem) => elem === req.user.id)) === -1)
      await chat.members.push(req.user.id);

    return await this.chatService.createChat(chat);
  }

  @Patch('members')
  @UseGuards(JwtAuthGuard)
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
  async addMembersToChat(
    @Request() req,
    @Body() { users, chatId }: CreateMemberDto,
  ) {
    if (
      !(await this.chatService.isUserInMembers({
        chatId: chatId,
        userId: req.user.id,
      }))
    )
      throw new UnauthorizedException();

    await users.forEach(async (elem) => {
      await this.chatService.addMember(elem, chatId);
    });
    return await this.chatService.getChat(chatId);
  }

  @Delete('members')
  @UseGuards(JwtAuthGuard)
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
    @Request() req,
    @Body() { userId, chatId }: CreateRemoveMemberDto,
  ) {
    return await this.chatService.removeMember(
      userId ? userId : req.user.id,
      chatId,
    );
  }

  @Delete(':chatId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204 })
  @ApiResponse({
    status: 400,
    description: `Chat with this id in not exitst`,
  })
  async deleteChat(@Request() req, @Param('chatId') chatId: string) {
    if (
      !(await this.chatService.isUserInMembers({
        chatId: +chatId,
        userId: req.user.id,
      }))
    )
      throw new UnauthorizedException();
    await this.chatService.removeChat(+chatId);
  }
}
