import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(+id, updateDto);
    }
    
    // This endpoint is kept for simplicity, but the update method is more versatile.
    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.appointmentsService.cancel(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.appointmentsService.remove(+id);
    }
}