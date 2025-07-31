export declare enum DoctorAvailability {
    AVAILABLE = "Available",
    BUSY = "Busy",
    OFF_DUTY = "Off Duty"
}
export declare class Doctor {
    id: number;
    name: string;
    specialization: string;
    availability: DoctorAvailability;
}
