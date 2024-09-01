import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'; // Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',       
      port: 5432,             
      username: 'postgres',
      password: 'ankit@123',
      database: 'Nestjs', 
      autoLoadEntities: true, 
      synchronize: true,    
    }), 
    AuthModule  // Import AuthModule where ContactsService is already provided
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
