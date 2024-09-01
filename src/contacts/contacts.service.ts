import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Contact } from '../auth/user.entity';
import { Auth } from '../auth/auth.entity'; // Import Auth entity

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,

    @InjectRepository(Auth)
    private authRepository: Repository<Auth>, // Inject Auth repository
  ) {}

  async createContact(userId: number, contactData: Partial<Contact>): Promise<Contact> {
    const user = await this.authRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const contact = this.contactsRepository.create({
      ...contactData,
      user,
    });

    return this.contactsRepository.save(contact);
  }

  async getContactsForUser(userId: number, page: number = 1, limit: number = 10, searchQuery?: string): Promise<Contact[]> {
    const skip = (page - 1) * limit;

    return this.contactsRepository.find({
      where: [
        { user: { id: userId }, name: Like(`%${searchQuery || ''}%`) },
        { user: { id: userId }, phoneNumber: Like(`%${searchQuery || ''}%`) },
      ],
      skip,
      take: limit,
    });
  }
}
