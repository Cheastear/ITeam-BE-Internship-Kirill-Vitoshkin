import { Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt.guard';
import { UnauthorizedException } from '@nestjs/common';

export type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleWare => {
  return (client, next) => {
    try {
      WsJwtGuard.validateToken(client);
      next();
    } catch (err) {
      console.error(err);
      next(new UnauthorizedException());
    }
  };
};
