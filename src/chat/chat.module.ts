import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from './chat.entity';
import Message from './message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), UsersModule],
  exports: [TypeOrmModule],
  controllers: [ChatController],
  providers: [ChatService, MessageService],
})
export class ChatModule {}
