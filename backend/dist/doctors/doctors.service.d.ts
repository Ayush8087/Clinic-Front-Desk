import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
export declare class DoctorsService {
    private doctorsRepository;
    constructor(doctorsRepository: Repository<Doctor>);
    findAll(): Promise<Doctor[]>;
    findOne(id: number): Promise<Doctor | null>;
    create(doctorData: {
        name: string;
        specialization: string;
    }): Promise<Doctor>;
}
