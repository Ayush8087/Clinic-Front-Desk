import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorAvailability, DoctorGender } from './doctor.entity';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}

    @Get()
    findAll(@Query('search') searchTerm?: string) {
        return this.doctorsService.findAll(searchTerm);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.doctorsService.findOne(+id);
    }

    @Post()
    create(@Body() doctorData: { name: string; specialization: string; gender: DoctorGender; location: string; availability: DoctorAvailability }) {
        return this.doctorsService.create(doctorData);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
        return this.doctorsService.update(+id, updateDoctorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.doctorsService.remove(+id);
    }
}