import { Doctor } from '../doctors/doctor.entity';
export declare enum AppointmentStatus {
    BOOKED = "Booked",
    COMPLETED = "Completed",
    CANCELED = "Canceled"
}
export declare class Appointment {
    id: number;
    patientName: string;
    appointmentTime: Date;
    status: AppointmentStatus;
    doctorId: number;
    doctor: Doctor;
}
