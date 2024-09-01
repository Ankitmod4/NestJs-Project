import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from './mail.service';

import { ContactsService } from '../contacts/contacts.service'; 
import { ContactsController } from '../contacts/contacts.controller';
import { Contact } from './user.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Contact]), // Auth and Contact entities
    JwtModule.register({
      secret: 'Hello whatsup sitback and relax enjoy the show',
      signOptions: { expiresIn: '1h' }, 
    }), 
  ],
  controllers: [AuthController, ContactsController], 
  providers: [AuthService, MailService, ContactsService, JwtStrategy], 
  exports: [AuthService, JwtModule, MailService,ContactsService],
})
export class AuthModule {}
