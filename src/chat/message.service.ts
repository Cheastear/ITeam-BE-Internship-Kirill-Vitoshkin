import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Chat from './chat.entity';
import Message from './message.entity';
import { CreateMessageDto } from 'src/dto/create-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UsersService,
  ) {}

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

    await this.chatRepository.save({
      ...dbChat,
      messages: dbChat.messages,
    });
    return;
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

  async isMessageInUser(userId: number, messageId: number) {
    const messages = await this.userService.getUserMessages(userId);

    return (await messages.findIndex((elem) => elem.id === messageId)) !== -1;
  }
}
