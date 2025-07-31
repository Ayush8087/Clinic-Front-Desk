import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
    @IsString()
    @IsNotEmpty()
    patientName: string;

    @IsInt()
    @IsNotEmpty()
    doctorId: number;

    @IsDateString()
    @IsNotEmpty()
    appointmentTime: string;
}