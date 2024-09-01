import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { CreateAuthDto } from '../create-auth.dto';
import { AuthService } from './auth.service'; 
import { MailService } from './mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly authService: AuthService, 
    private readonly mailService: MailService,
  ) {}

  @Post()
  async create(@Body() createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.authRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException('Email already signed up. Go to login.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.authService.hashPassword(password);
    const verificationToken = await this.authService.generateToken(email);

    const newAuth = this.authRepository.create({ 
      ...createAuthDto, 
      password: hashedPassword, 
    });

    const savedAuth = await this.authRepository.save(newAuth);
    console.log('Data saved:', savedAuth);

    await this.mailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Registration successful. Please check your email for verification.', savedAuth };
  }

  @Post('login') 
  async login(@Body() createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
   
    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.authService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.authService.generateToken(email);
 
    return { message: 'Login successful', token };
  }
}
