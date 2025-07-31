import { DoctorsService } from './doctors.service';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    findAll(): Promise<import("./doctor.entity").Doctor[]>;
    findOne(id: string): Promise<import("./doctor.entity").Doctor>;
    create(doctorData: {
        name: string;
        specialization: string;
    }): Promise<import("./doctor.entity").Doctor>;
}
