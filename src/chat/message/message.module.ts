import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/chat/chat.entity';
import Message from './message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessageGateway } from './message.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from '../chat.module';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '3h' },
    }),
    ChatModule,
  ],
  exports: [TypeOrmModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
