import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueStatus, PatientPriority } from './queue.entity';

@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Get()
    findAll() {
        return this.queueService.findAll();
    }

    @Get('stats')
    getStats() {
        return this.queueService.getQueueStats();
    }

    @Get('workload')
    getDoctorWorkload() {
        return this.queueService.getQueueStats();
    }

    @Post()
    addToQueue(@Body() body: { patientName: string; priority?: PatientPriority; doctorId?: number }) {
        return this.queueService.addToQueue(body.patientName, body.priority, body.doctorId);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: QueueStatus,
    ) {
        return this.queueService.updateStatus(+id, status);
    }

    @Patch(':id/prioritize')
    prioritize(@Param('id') id: string) {
        return this.queueService.prioritize(+id);
    }

    @Delete(':id')
    removeFromQueue(@Param('id') id: string) {
        return this.queueService.removeFromQueue(+id);
    }

    @Patch(':id/doctor')
    changeDoctor(
        @Param('id') id: string,
        @Body('doctorId') doctorId: number | null,
    ) {
        return this.queueService.changeDoctor(+id, doctorId);
    }
}