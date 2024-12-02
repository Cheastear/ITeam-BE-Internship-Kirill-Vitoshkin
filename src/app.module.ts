import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import User from './users/users.entity';
import Chat from './chat/chat.entity';
import Message from './chat/message/message.entity';
import 'dotenv/config';
import { MessageModule } from './chat/message/message.module';

@Module({
  imports: [
    UsersModule,
    ChatModule,
    AuthModule,
    MessageModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_CONNECT,
      entities: [User, Chat, Message],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
