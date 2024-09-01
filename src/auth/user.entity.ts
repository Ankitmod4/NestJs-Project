import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Auth } from '../auth/auth.entity';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  postalAddress: string;

  @Column()
  userId: number;

  @ManyToOne(() => Auth, auth => auth.contacts)
  user: Auth;
}
