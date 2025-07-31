import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus, PatientPriority } from './queue.entity';
export declare class QueueService {
    private queueRepository;
    constructor(queueRepository: Repository<QueueEntry>);
    private getNextQueueNumber;
    addToQueue(patientName: string, priority?: PatientPriority, doctorId?: number): Promise<QueueEntry>;
    findAll(): Promise<QueueEntry[]>;
    updateStatus(id: number, status: QueueStatus): Promise<QueueEntry>;
    prioritize(id: number): Promise<QueueEntry>;
}
