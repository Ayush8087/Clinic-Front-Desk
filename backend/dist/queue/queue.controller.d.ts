import { QueueService } from './queue.service';
import { QueueStatus, PatientPriority } from './queue.entity';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    findAll(): Promise<import("./queue.entity").QueueEntry[]>;
    addToQueue(body: {
        patientName: string;
        priority?: PatientPriority;
        doctorId?: number;
    }): Promise<import("./queue.entity").QueueEntry>;
    updateStatus(id: string, status: QueueStatus): Promise<import("./queue.entity").QueueEntry>;
    prioritize(id: string): Promise<import("./queue.entity").QueueEntry>;
}
