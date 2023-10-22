import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributionFonctionnelleService } from './attribution-fonctionnelle.service';
import { CreateAttributionFonctionnelleDto } from './dto/create-attribution-fonctionnelle.dto';
import { UpdateAttributionFonctionnelleDto } from './dto/update-attribution-fonctionnelle.dto';

@Controller('attribution-fonctionnelle')
export class AttributionFonctionnelleController {
  constructor(private readonly attributionFonctionnelleService: AttributionFonctionnelleService) {}

  @Post()
  create(@Body() createAttributionFonctionnelleDto: CreateAttributionFonctionnelleDto) {
    return this.attributionFonctionnelleService.create(createAttributionFonctionnelleDto);
  }

  @Get()
  findAll() {
    return this.attributionFonctionnelleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributionFonctionnelleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributionFonctionnelleDto: UpdateAttributionFonctionnelleDto) {
    return this.attributionFonctionnelleService.update(id, updateAttributionFonctionnelleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributionFonctionnelleService.remove(id);
  }
}
