import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from '../doctors/doctor.entity';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentsRepository: Repository<Appointment>,
        @InjectRepository(Doctor)
        private doctorsRepository: Repository<Doctor>,
    ) {}

    findAll(): Promise<Appointment[]> {
        return this.appointmentsRepository.find({ relations: ['doctor'] });
    }

    async create(createDto: CreateAppointmentDto): Promise<Appointment> {
        const doctor = await this.doctorsRepository.findOneBy({ id: createDto.doctorId });
        if (!doctor) {
            throw new NotFoundException(`Doctor with ID "${createDto.doctorId}" not found`);
        }

        const newAppointment = this.appointmentsRepository.create({
            patientName: createDto.patientName,
            appointmentTime: new Date(createDto.appointmentTime),
            doctor: doctor,
        });

        return this.appointmentsRepository.save(newAppointment);
    }

    async update(id: number, updateDto: UpdateAppointmentDto): Promise<Appointment> {
        const appointment = await this.appointmentsRepository.findOneBy({ id });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
        
        if (updateDto.appointmentTime) {
            appointment.appointmentTime = new Date(updateDto.appointmentTime);
        }
        if (updateDto.status) {
            appointment.status = updateDto.status;
        }

        return this.appointmentsRepository.save(appointment);
    }

    async cancel(id: number): Promise<Appointment> {
        const appointment = await this.appointmentsRepository.findOneBy({ id });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
        appointment.status = AppointmentStatus.CANCELED;
        return this.appointmentsRepository.save(appointment);
    }

    async remove(id: number): Promise<void> {
        const appointment = await this.appointmentsRepository.findOneBy({ id });
        if (!appointment) {
            throw new NotFoundException(`Appointment with ID "${id}" not found`);
        }
        
        await this.appointmentsRepository.remove(appointment);
    }
}