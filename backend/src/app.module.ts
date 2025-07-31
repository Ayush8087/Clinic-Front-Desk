import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import Entities
import { User } from './users/user.entity';
import { Doctor } from './doctors/doctor.entity';
import { QueueEntry } from './queue/queue.entity';
import { Appointment } from './appointments/appointment.entity';

// Import Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { QueueModule } from './queue/queue.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ayush8087',
      database: 'clinic_db',
      entities: [User, Doctor, QueueEntry, Appointment],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    DoctorsModule,
    QueueModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}