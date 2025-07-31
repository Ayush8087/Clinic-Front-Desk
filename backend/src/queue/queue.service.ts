import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus, PatientPriority } from './queue.entity';

@Injectable()
export class QueueService {
    constructor(
        @InjectRepository(QueueEntry)
        private queueRepository: Repository<QueueEntry>,
    ) {}

    private async getNextQueueNumber(): Promise<number> {
        const lastEntry = await this.queueRepository.findOne({
            where: {},
            order: { queueNumber: 'DESC' },
        });
        return lastEntry ? lastEntry.queueNumber + 1 : 1;
    }

    async addToQueue(patientName: string, priority: PatientPriority = PatientPriority.NORMAL, doctorId?: number): Promise<QueueEntry> {
        const queueNumber = await this.getNextQueueNumber();
        const newEntry = this.queueRepository.create({
            patientName,
            queueNumber,
            priority,
            doctorId: doctorId || null,
        });
        return this.queueRepository.save(newEntry);
    }

    findAll(): Promise<QueueEntry[]> {
        return this.queueRepository
            .createQueryBuilder('queueEntry')
            .leftJoinAndSelect('queueEntry.doctor', 'doctor')
            .orderBy("CASE WHEN queueEntry.status = 'Completed' THEN 1 ELSE 0 END", "ASC")
            .addOrderBy('queueEntry.priority', 'DESC')
            .addOrderBy('queueEntry.arrivalTime', 'ASC')
            .getMany();
    }

    async updateStatus(id: number, status: QueueStatus): Promise<QueueEntry> {
        await this.queueRepository.update(id, { status });
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        return entry;
    }
    
    async prioritize(id: number): Promise<QueueEntry> {
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        entry.priority = PatientPriority.URGENT;
        return this.queueRepository.save(entry);
    }
}