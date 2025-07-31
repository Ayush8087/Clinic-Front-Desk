import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @Get()
    findAll() {
        return this.appointmentsService.findAll();
    }

    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.appointmentsService.cancel(+id);
    }
}