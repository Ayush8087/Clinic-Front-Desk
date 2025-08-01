import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorAvailability, DoctorGender } from './doctor.entity';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private doctorsRepository: Repository<Doctor>,
    ) {}

    findAll(searchTerm?: string): Promise<Doctor[]> {
        const query = this.doctorsRepository.createQueryBuilder('doctor');

        if (searchTerm) {
            query.where('doctor.name LIKE :searchTerm OR doctor.specialization LIKE :searchTerm', {
                searchTerm: `%${searchTerm}%`,
            });
        }

        return query.getMany();
    }

    findOne(id: number): Promise<Doctor | null> {
        return this.doctorsRepository.findOneBy({ id });
    }

    create(doctorData: { name: string; specialization: string; gender: DoctorGender; location: string; availability: DoctorAvailability }): Promise<Doctor> {
        const newDoctor = this.doctorsRepository.create(doctorData);
        return this.doctorsRepository.save(newDoctor);
    }

    async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
        await this.doctorsRepository.update(id, updateDoctorDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.doctorsRepository.delete(id);
    }
}