// backend/src/doctors/dto/update-doctor.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { DoctorAvailability } from '../doctor.entity';

export class UpdateDoctorDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    specialization?: string;

    @IsEnum(DoctorAvailability)
    @IsOptional()
    availability?: DoctorAvailability;
}