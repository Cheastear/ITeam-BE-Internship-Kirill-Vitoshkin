import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import Chat from 'src/chat/chat.entity';
import Message from 'src/chat/message.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  dateOfBirth: Date;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ enum: ['admin', 'user', 'moderator'] })
  role: 'admin' | 'user' | 'moderator';

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  lastLogin: Date;

  @Column()
  profilePicture: string;

  @Column('text')
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Chat, (chat) => chat.members, { lazy: true })
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user, { lazy: true })
  messages: Message[];
}
