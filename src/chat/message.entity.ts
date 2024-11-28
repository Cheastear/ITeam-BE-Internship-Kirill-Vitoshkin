import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import User from 'src/users/users.entity';
import Chat from './chat.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({ example: 'Message for somebody', description: 'Message' })
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  @ApiProperty({
    type: () => User,
    example: 1,
    description: 'The user who sent the message send only user id',
  })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @ApiProperty({
    type: () => User,
    example: 1,
    description: 'The chat the message belongs to. Send only chat id',
  })
  chat: Chat;

  @CreateDateColumn()
  createdAt: Date;
}
