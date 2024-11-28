import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import User from 'src/users/users.entity';
import Message from './message.entity';

@Entity()
export default class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Group',
    description: 'Group name',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'List of users',
    example: [],
  })
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  members: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @CreateDateColumn()
  createAt: Date;
}
