import { IsEnum, IsDateString, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';

export class UpdateAppointmentDto {
    @IsDateString()
    @IsOptional()
    appointmentTime?: string;

    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;
}