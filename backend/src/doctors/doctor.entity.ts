import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum DoctorAvailability {
    AVAILABLE = 'Available',
    BUSY = 'Busy',
    OFF_DUTY = 'Off Duty',
}

export enum DoctorGender {
    MALE = 'Male',
    FEMALE = 'Female',
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
        enum: DoctorGender,
    })
    gender: DoctorGender;

    @Column()
    location: string;

    @Column({
        type: 'enum',
        enum: DoctorAvailability,
        default: DoctorAvailability.AVAILABLE,
    })
    availability: DoctorAvailability;

    // --- NEW FIELD ---
    @Column({ type: 'varchar', length: 255, nullable: true }) // nullable means it's optional
    nextAvailableAt: string | null;
}