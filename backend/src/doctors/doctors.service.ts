import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private doctorsRepository: Repository<Doctor>,
    ) {}
    

    findAll(): Promise<Doctor[]> {
        return this.doctorsRepository.find();
    }

    findOne(id: number): Promise<Doctor | null> {
        return this.doctorsRepository.findOneBy({ id });
    }

    // Add this to your DoctorsService class
// Add this method inside the DoctorsService class
async create(doctorData: { name: string; specialization: string }): Promise<Doctor> {
    const newDoctor = this.doctorsRepository.create(doctorData);
    return this.doctorsRepository.save(newDoctor);
}
}

