import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './doctor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Doctor])],
    providers: [DoctorsService],
    controllers: [DoctorsController],
})
export class DoctorsModule {}