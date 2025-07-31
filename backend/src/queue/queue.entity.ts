import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../doctors/doctor.entity';

export enum QueueStatus {
    WAITING = 'Waiting',
    WITH_DOCTOR = 'With Doctor',
    COMPLETED = 'Completed',
}

export enum PatientPriority {
    NORMAL = 'Normal',
    URGENT = 'Urgent',
}

@Entity()
export class QueueEntry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    patientName: string;

    @Column()
    queueNumber: number;

    @Column({
        type: 'enum',
        enum: QueueStatus,
        default: QueueStatus.WAITING,
    })
    status: QueueStatus;

    @Column({
        type: 'enum',
        enum: PatientPriority,
        default: PatientPriority.NORMAL,
    })
    priority: PatientPriority;

    @CreateDateColumn()
    arrivalTime: Date;

    @ManyToOne(() => Doctor, { nullable: true, eager: true })
    @JoinColumn({ name: 'doctorId' })
    doctor: Doctor | null;

    @Column({ nullable: true })
    doctorId: number | null;
}