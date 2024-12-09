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
import { MessageModule } from './chat/message/message.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    MessageModule,
    ChatModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_CONNECT'),
        entities: [User, Chat, Message],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
