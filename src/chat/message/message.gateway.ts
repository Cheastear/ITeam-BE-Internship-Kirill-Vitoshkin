import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Message from './message.entity';
import { SocketAuthMiddleware } from 'src/auth/ws-jwt/ws.mw';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { ChatService } from '../chat.service';

type ResponceType = { chatId: number; message: Message };

interface ServerToClientMessage {
  newMessage: (payload: ResponceType) => void;
}

@WebSocketGateway()
export class MessageGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server<any, ServerToClientMessage>;

  afterInit(socket: Socket) {
    socket.use(SocketAuthMiddleware() as any);
  }

  private readonly logger = new Logger(MessageGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleMessage(client: Socket, chatId: number) {
    if (
      !(await this.chatService.isUserInMembers({
        chatId,
        userId: client.data.user.id,
      }))
    )
      return new UnauthorizedException();

    this.logger.log(`Client ${client.id} joined chat: ${chatId}`);
    await client.join(chatId.toString());
    return { status: 'joined', chatId };
  }

  @SubscribeMessage('newMessage')
  sendMessage(chatId: number, message: Message) {
    this.logger.log(`New message in chat ${chatId}: ${message.content}`);

    this.server.to(chatId.toString()).emit('newMessage', { chatId, message });
    return { status: 'message sent', chatId };
  }
}
