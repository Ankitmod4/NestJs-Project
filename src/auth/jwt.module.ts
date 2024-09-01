
import { Module } from '@nestjs/common';
import { JwtModule as JwtModuleFromNestjs } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModuleFromNestjs.register({ 
      secret: 'Hey buddy sit back and relax and enjoy the show ', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class JwtModule {}
