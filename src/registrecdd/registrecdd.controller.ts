import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistrecddService } from './registrecdd.service';
import { CreateRegistrecddDto } from './dto/create-registrecdd.dto';
import { UpdateRegistrecddDto } from './dto/update-registrecdd.dto';

@Controller('registrecdd')
export class RegistrecddController {
  constructor(private readonly registrecddService: RegistrecddService) {}

  @Post()
  create(@Body() createRegistrecddDto: CreateRegistrecddDto) {
    return this.registrecddService.create(createRegistrecddDto);
  }

  @Get()
  findAll() {
    return this.registrecddService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrecddService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrecddDto: UpdateRegistrecddDto) {
    return this.registrecddService.update(id, updateRegistrecddDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrecddService.remove(id);
  }
}
