import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

export enum AppointmentStatus {
    BOOKED = 'Booked',
    COMPLETED = 'Completed',
    CANCELED = 'Canceled',
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patientName: string;

    @Column()
    appointmentTime: Date;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.BOOKED,
    })
    status: AppointmentStatus;

    @Column()
    doctorId: number;

    @ManyToOne(() => Doctor)
    @JoinColumn({ name: 'doctorId' })
    doctor: Doctor;
}