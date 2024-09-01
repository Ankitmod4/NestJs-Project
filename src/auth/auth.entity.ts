import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Contact } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number; 
   
  @Column()
  email: string; 
  @Column() 
  name: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];
}
