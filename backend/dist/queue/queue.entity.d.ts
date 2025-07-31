import { Doctor } from '../doctors/doctor.entity';
export declare enum QueueStatus {
    WAITING = "Waiting",
    WITH_DOCTOR = "With Doctor",
    COMPLETED = "Completed"
}
export declare enum PatientPriority {
    NORMAL = "Normal",
    URGENT = "Urgent"
}
export declare class QueueEntry {
    id: number;
    patientName: string;
    queueNumber: number;
    status: QueueStatus;
    priority: PatientPriority;
    arrivalTime: Date;
    doctor: Doctor | null;
    doctorId: number | null;
}
