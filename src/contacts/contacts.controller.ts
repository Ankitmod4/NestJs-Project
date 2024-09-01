import { Controller, Get, Post, Body, Req, Logger, UnauthorizedException, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from '../auth/user.entity';
import { AuthService } from '../auth/auth.service';

@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(
    private readonly contactsService: ContactsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createContact(@Body() body: { token: string; contactData: Partial<Contact> }) {
    this.logger.log(`Request Body: ${JSON.stringify(body)}`);

    const user = await this.authService.validateToken(body.token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.contactsService.createContact(user.id, body.contactData);
  }

  @Get()
  async getContacts(
    @Body() body: { token: string },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = ''
  ) {
    this.logger.log(`Request Token: ${body.token}`);

    const user = await this.authService.validateToken(body.token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.contactsService.getContactsForUser(user.id, page, limit, search);
  }
}
  