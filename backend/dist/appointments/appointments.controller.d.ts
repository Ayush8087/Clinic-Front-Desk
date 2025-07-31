import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(): Promise<import("./appointment.entity").Appointment[]>;
    create(createAppointmentDto: CreateAppointmentDto): Promise<import("./appointment.entity").Appointment>;
    cancel(id: string): Promise<import("./appointment.entity").Appointment>;
}
