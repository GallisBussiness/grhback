import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistretempService } from './registretemp.service';
import { CreateRegistretempDto } from './dto/create-registretemp.dto';
import { UpdateRegistretempDto } from './dto/update-registretemp.dto';

@Controller('registretemp')
export class RegistretempController {
  constructor(private readonly registretempService: RegistretempService) {}

  @Post()
  create(@Body() createRegistretempDto: CreateRegistretempDto) {
    return this.registretempService.create(createRegistretempDto);
  }

  @Get()
  findAll() {
    return this.registretempService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registretempService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistretempDto: UpdateRegistretempDto) {
    return this.registretempService.update(id, updateRegistretempDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registretempService.remove(id);
  }
}
