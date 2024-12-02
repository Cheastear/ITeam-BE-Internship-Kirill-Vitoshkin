import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from './chat.entity';
import { UsersModule } from 'src/users/users.module';
import Message from './message/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), UsersModule],
  exports: [TypeOrmModule, ChatService],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
