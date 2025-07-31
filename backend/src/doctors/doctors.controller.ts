import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) {}
    

        
    
    @Get()
    findAll() {
        return this.doctorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.doctorsService.findOne(+id);
    }

    @Post()
    create(@Body() doctorData: { name: string; specialization: string }) {
        return this.doctorsService.create(doctorData);
    }
}