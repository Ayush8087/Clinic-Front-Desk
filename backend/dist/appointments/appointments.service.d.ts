import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Doctor } from '../doctors/doctor.entity';
export declare class AppointmentsService {
    private appointmentsRepository;
    private doctorsRepository;
    constructor(appointmentsRepository: Repository<Appointment>, doctorsRepository: Repository<Doctor>);
    findAll(): Promise<Appointment[]>;
    create(createDto: CreateAppointmentDto): Promise<Appointment>;
    cancel(id: number): Promise<Appointment>;
}
