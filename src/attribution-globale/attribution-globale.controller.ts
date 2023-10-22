import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttributionGlobaleService } from './attribution-globale.service';
import { CreateAttributionGlobaleDto } from './dto/create-attribution-globale.dto';
import { UpdateAttributionGlobaleDto } from './dto/update-attribution-globale.dto';

@Controller('attribution-globale')
export class AttributionGlobaleController {
  constructor(private readonly attributionGlobaleService: AttributionGlobaleService) {}

  @Post()
  create(@Body() createAttributionGlobaleDto: CreateAttributionGlobaleDto) {
    return this.attributionGlobaleService.create(createAttributionGlobaleDto);
  }

  @Get()
  findAll() {
    return this.attributionGlobaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributionGlobaleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttributionGlobaleDto: UpdateAttributionGlobaleDto) {
    return this.attributionGlobaleService.update(id, updateAttributionGlobaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributionGlobaleService.remove(id);
  }
}
