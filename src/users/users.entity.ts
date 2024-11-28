import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Chat from 'src/chat/chat.entity';
import Message from 'src/chat/message.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'username',
    description: 'User chosen display name',
  })
  @Column()
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address for account',
  })
  @Column()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Hashed password for security',
  })
  @Column()
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    example: 'Nolan',
    description: 'User last name',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    example: new Date('11.01.2011'),
    description: 'User date of birth',
  })
  @CreateDateColumn()
  dateOfBirth: Date;

  @ApiProperty({
    example: '+1(234)56789012',
    description: 'User contact phone number',
  })
  @Column()
  phoneNumber: string;

  @ApiProperty({
    example: 'st.first 21s',
    description: 'User physical address',
  })
  @Column()
  address: string;

  @ApiProperty({
    example: 'user',
    description: 'User role (e.g., admin, user, moderator)',
  })
  @Column({ enum: ['admin', 'user', 'moderator'] })
  role: 'admin' | 'user' | 'moderator';

  @ApiProperty({
    example: true,
    description: 'Indicates if the user account is active',
  })
  @Column()
  isActive: boolean;

  @CreateDateColumn()
  lastLogin: Date;

  @ApiProperty({
    example: 'URL to photo',
    description: 'URL or path to users profile picture',
  })
  @Column()
  profilePicture: string;

  @ApiProperty({
    example: 'Biography',
    description: 'Short biography or description of the user',
  })
  @Column('text')
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Chat, (chat) => chat.members, { lazy: true })
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user, { lazy: true })
  messages: Message[];
}
