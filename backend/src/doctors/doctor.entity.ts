import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum DoctorAvailability {
    AVAILABLE = 'Available',
    BUSY = 'Busy',
    OFF_DUTY = 'Off Duty',
}

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    specialization: string;

    @Column({
        type: 'enum',
        enum: DoctorAvailability,
        default: DoctorAvailability.AVAILABLE,
    })
    availability: DoctorAvailability;
}