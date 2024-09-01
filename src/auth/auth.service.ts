import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth } from './auth.entity'; 
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>, 
  ) {}

  async hashPassword(password: string): Promise<string> {
    if (!password) {
      console.error('Password is undefined or null:', password);
      throw new Error('Password is required');
    }

    const salt = await bcrypt.genSalt(this.saltRounds);
    console.log('Generated salt:', salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed password:', hashedPassword);
    return hashedPassword;
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      console.error('Password or hashedPassword is undefined or null:', { password, hashedPassword });
      throw new Error('Password and hashed password are required for comparison');
    }
    return bcrypt.compare(password, hashedPassword);
  }

  async generateToken(email: string): Promise<string> {
    if (!email) {
      throw new Error('Email is required to generate a token');
    }
    return this.jwtService.sign({ email });
  }

  async validateToken(token: string): Promise<Auth | null> {
    if (!token) {
      console.error('Token is undefined or null:', token);
      throw new Error('Token is required for validation');
    }

    try {
      const decoded = this.jwtService.verify(token);
      return this.authRepository.findOne({ where: { email: decoded.email } });
    } catch (error) {
      console.error('Error validating token:', error);
      return null;
    }
  }
}
