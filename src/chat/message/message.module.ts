import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/chat/chat.entity';
import Message from './message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageGateway } from './message.gateway';
import { ChatModule } from '../chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), UsersModule, ChatModule],
  exports: [TypeOrmModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
