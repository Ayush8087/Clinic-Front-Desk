import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { QueueEntry } from './queue.entity';
import { Doctor } from '../doctors/doctor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([QueueEntry, Doctor])],
    providers: [QueueService],
    controllers: [QueueController],
})
export class QueueModule {}