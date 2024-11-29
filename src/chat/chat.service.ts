import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Chat from './chat.entity';
import Message from './message.entity';
import { UsersService } from 'src/users/users.service';
import CreateChatDto from 'src/dto/create-chat.dto';
import { CreateMessageDto } from 'src/dto/create-message.dto';
import CreateRemoveMemberDto from 'src/dto/create-remove-member.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UsersService,
  ) {}

  async getChat(chatId: number) {
    const dbChat = await this.chatRepository.findOneBy({ id: chatId });
    if (!dbChat) throw new BadRequestException(chatId);

    return dbChat;
  }

  async getChatMembers(chatId: number) {
    const dbChat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['members'],
    });
    if (!dbChat) throw new BadRequestException(chatId);

    return await dbChat.members;
  }

  async createChat(chat: CreateChatDto) {
    const newChat = await this.chatRepository.save({
      ...chat,
      members: [],
      messages: [],
      createAt: new Date(),
    });

    if (chat.members.length !== 0) {
      await chat.members.forEach(
        async (elem) => await this.addMember(+elem, newChat.id),
      );
    }
    return await this.chatRepository.findOneBy({ id: newChat.id });
  }

  async addMember(userId: number, chatId: number) {
    const dbUser = await this.userService.getOneUser(userId);
    if (!dbUser)
      throw new BadRequestException(`User with id: ${userId} is not exist`);

    const dbChat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['members'],
    });
    if (await this.isUserInMembers({ userId, chatId }))
      throw new BadRequestException(
        `User with id: ${dbUser.id} already in that chat`,
      );

    await dbChat.members.push(dbUser);

    return await this.chatRepository.save(dbChat);
  }

  async removeMember(userId: number, chatId: number) {
    const dbChat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['members'],
    });
    if (!dbChat)
      throw new BadRequestException('Chat with this id is not exist');

    const index = await dbChat.members.findIndex((elem) => elem.id === userId);
    if (index === -1)
      throw new BadRequestException(
        'This user is already removed from this chat',
      );

    await dbChat.members.splice(index, 1);

    return await this.chatRepository.save(dbChat);
  }

  async removeChat(chatId: number) {
    const dbChat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['messages'],
    });
    if (!dbChat)
      throw new BadRequestException(`Chat with id: ${chatId} in not exitst`);

    await dbChat.messages.forEach(
      async (elem) => await this.messageRepository.delete(elem.id),
    );

    await this.chatRepository.delete(dbChat.id);

    return await this.chatRepository.findOneBy({ id: chatId });
  }

  async isUserInMembers(message: CreateRemoveMemberDto) {
    const dbChat = await this.chatRepository.findOne({
      where: { id: message.chatId },
      relations: ['members'],
    });

    return (
      (await dbChat.members.findIndex(
        (elem) => elem.id === +message.userId,
      )) !== -1
    );
  }

  async createMessage(message: CreateMessageDto) {
    return await this.messageRepository.save({
      ...message,
      createdAt: new Date(),
      user: await this.userService.getOneUser(+message.user),
    });
  }

  async addMessageToChat(message: Message) {
    const dbChat = await this.chatRepository.findOne({
      where: { id: +message.chat },
      relations: ['messages'],
    });
    if (!dbChat)
      throw new BadRequestException('Chat with this id is not exist');
    await dbChat.messages.push(message);

    return await this.chatRepository.save({
      ...dbChat,
      messages: dbChat.messages,
    });
  }

  async updateMessage(messageId: number, message: Partial<CreateMessageDto>) {
    if (
      (
        await this.messageRepository.update(messageId, {
          content: message.content,
        })
      ).affected === 0
    )
      throw new BadRequestException(
        `Message with id: ${messageId} is not exist`,
      );

    return await this.messageRepository.findOneBy({ id: messageId });
  }

  async deleteMessage(messageId: number) {
    if ((await this.messageRepository.delete(messageId)).affected === 0)
      throw new BadRequestException(
        `Message with id: ${messageId} is not exist`,
      );

    return;
  }
}
