import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctors/doctor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Appointment, Doctor])],
    providers: [AppointmentsService],
    controllers: [AppointmentsController],
})
export class AppointmentsModule {}