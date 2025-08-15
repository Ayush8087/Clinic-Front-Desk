import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueEntry, QueueStatus, PatientPriority } from './queue.entity';
import { Doctor } from '../doctors/doctor.entity';

@Injectable()
export class QueueService {
    constructor(
        @InjectRepository(QueueEntry)
        private queueRepository: Repository<QueueEntry>,
        @InjectRepository(Doctor)
        private doctorsRepository: Repository<Doctor>,
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
        
        const savedEntry = await this.queueRepository.save(newEntry);
        
        // If no specific doctor was assigned, try to auto-assign one
        if (!doctorId) {
            await this.autoAssignDoctor(savedEntry.id);
        }
        
        return savedEntry;
    }

    async findAll(): Promise<QueueEntry[]> {
        return this.queueRepository
            .createQueryBuilder('queueEntry')
            .leftJoinAndSelect('queueEntry.doctor', 'doctor')
            .orderBy("CASE WHEN queueEntry.status = 'Completed' THEN 1 ELSE 0 END", "ASC")
            .addOrderBy('queueEntry.priority', 'DESC')
            .addOrderBy('queueEntry.arrivalTime', 'ASC')
            .getMany();
    }

    async updateStatus(id: number, status: QueueStatus): Promise<QueueEntry> {
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }

        // Update the status
        await this.queueRepository.update(id, { status });
        
        // If status is being set to "Completed", free up the doctor and assign next patient
        if (status === QueueStatus.COMPLETED) {
            await this.handlePatientCompletion(entry);
        }
        
        // If status is being set to "With Doctor", ensure doctor is assigned
        if (status === QueueStatus.WITH_DOCTOR && !entry.doctorId) {
            await this.autoAssignDoctor(id);
        }

        const updatedEntry = await this.queueRepository.findOneBy({ id });
        if (!updatedEntry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        return updatedEntry;
    }
    
    async prioritize(id: number): Promise<QueueEntry> {
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        entry.priority = PatientPriority.URGENT;
        return this.queueRepository.save(entry);
    }

    private async handlePatientCompletion(completedEntry: QueueEntry): Promise<void> {
        if (completedEntry.doctorId) {
            const doctorId = completedEntry.doctorId;
            
            // Remove the doctor assignment from the completed patient
            await this.queueRepository.update(completedEntry.id, { doctorId: null });
            
            // Automatically promote the next patient assigned to the same doctor
            await this.promoteNextPatientForSameDoctor(doctorId);
        }
    }

    private async promoteNextPatientForSameDoctor(doctorId: number): Promise<void> {
        // Find the next patient assigned to the same doctor who is currently waiting
        const nextPatient = await this.queueRepository
            .createQueryBuilder('queueEntry')
            .where('queueEntry.doctorId = :doctorId', { doctorId })
            .andWhere('queueEntry.status = :status', { status: QueueStatus.WAITING })
            .orderBy('queueEntry.priority', 'DESC')
            .addOrderBy('queueEntry.arrivalTime', 'ASC')
            .getOne();

        if (nextPatient) {
            // Automatically promote this patient to "With Doctor" status
            await this.queueRepository.update(nextPatient.id, {
                status: QueueStatus.WITH_DOCTOR
            });
        }
    }

    private async assignNextPatientToDoctor(doctorId: number): Promise<void> {
        // Find the next waiting patient (prioritizing urgent patients)
        const nextPatient = await this.queueRepository
            .createQueryBuilder('queueEntry')
            .where('queueEntry.status = :status', { status: QueueStatus.WAITING })
            .andWhere('queueEntry.doctorId IS NULL')
            .orderBy('queueEntry.priority', 'DESC')
            .addOrderBy('queueEntry.arrivalTime', 'ASC')
            .getOne();

        if (nextPatient) {
            // Assign the doctor to this patient and update status
            await this.queueRepository.update(nextPatient.id, {
                doctorId: doctorId,
                status: QueueStatus.WITH_DOCTOR
            });
        }
    }

    private async autoAssignDoctor(patientId: number): Promise<void> {
        // Find an available doctor (not currently assigned to any active patient)
        const availableDoctor = await this.doctorsRepository
            .createQueryBuilder('doctor')
            .leftJoin('queue', 'queue', 'queue.doctorId = doctor.id AND queue.status IN (:...activeStatuses)', {
                activeStatuses: [QueueStatus.WAITING, QueueStatus.WITH_DOCTOR]
            })
            .where('queue.id IS NULL')
            .getOne();

        if (availableDoctor) {
            // Assign the doctor to this patient
            await this.queueRepository.update(patientId, {
                doctorId: availableDoctor.id,
                status: QueueStatus.WITH_DOCTOR
            });
        }
    }



    async getQueueStats(): Promise<{
        waiting: number;
        withDoctor: number;
        completed: number;
        total: number;
    }> {
        const [waiting, withDoctor, completed, total] = await Promise.all([
            this.queueRepository.count({ where: { status: QueueStatus.WAITING } }),
            this.queueRepository.count({ where: { status: QueueStatus.WITH_DOCTOR } }),
            this.queueRepository.count({ where: { status: QueueStatus.COMPLETED } }),
            this.queueRepository.count()
        ]);

        return { waiting, withDoctor, completed, total };
    }

    async removeFromQueue(id: number): Promise<void> {
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }

        // If the patient was with a doctor, automatically promote the next patient
        if (entry.doctorId && entry.status === QueueStatus.WITH_DOCTOR) {
            const doctorId = entry.doctorId;
            await this.promoteNextPatientForSameDoctor(doctorId);
        }

        // Remove the entry from the queue
        await this.queueRepository.remove(entry);
    }

    async changeDoctor(id: number, doctorId: number | null): Promise<QueueEntry> {
        const entry = await this.queueRepository.findOneBy({ id });
        if (!entry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }

        // If assigning a new doctor, verify the doctor exists
        if (doctorId) {
            const doctor = await this.doctorsRepository.findOneBy({ id: doctorId });
            if (!doctor) {
                throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
            }
        }

        // Update the doctor assignment
        await this.queueRepository.update(id, { doctorId });

        // Return the updated entry
        const updatedEntry = await this.queueRepository.findOneBy({ id });
        if (!updatedEntry) {
            throw new NotFoundException(`Queue entry with ID "${id}" not found`);
        }
        return updatedEntry;
    }

    // Method to get doctor's current workload
    async getDoctorWorkload(doctorId: number): Promise<{
        treating: number;
        waiting: number;
        total: number;
    }> {
        const [treating, waiting] = await Promise.all([
            this.queueRepository.count({
                where: {
                    doctorId: doctorId,
                    status: QueueStatus.WITH_DOCTOR
                }
            }),
            this.queueRepository.count({
                where: {
                    doctorId: doctorId,
                    status: QueueStatus.WAITING
                }
            })
        ]);

        return {
            treating,
            waiting,
            total: treating + waiting
        };
    }
}