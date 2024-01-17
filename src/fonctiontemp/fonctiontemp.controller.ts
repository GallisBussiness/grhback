import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FonctiontempService } from './fonctiontemp.service';
import { CreateFonctiontempDto } from './dto/create-fonctiontemp.dto';
import { UpdateFonctiontempDto } from './dto/update-fonctiontemp.dto';

@Controller('fonctiontemp')
export class FonctiontempController {
  constructor(private readonly fonctiontempService: FonctiontempService) {}

  @Post()
  create(@Body() createFonctiontempDto: CreateFonctiontempDto) {
    return this.fonctiontempService.create(createFonctiontempDto);
  }

  @Get()
  findAll() {
    return this.fonctiontempService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fonctiontempService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFonctiontempDto: UpdateFonctiontempDto) {
    return this.fonctiontempService.update(id, updateFonctiontempDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fonctiontempService.remove(id);
  }
}
