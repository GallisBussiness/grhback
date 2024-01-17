import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FichepresenceService } from './fichepresence.service';
import { CreateFichepresenceDto } from './dto/create-fichepresence.dto';
import { UpdateFichepresenceDto } from './dto/update-fichepresence.dto';
import { PresenceService } from 'src/presence/presence.service';
import { MonthDto } from './dto/month.dto';

@Controller('fichepresence')
export class FichepresenceController {
  constructor(private readonly fichepresenceService: FichepresenceService,private readonly presenceService: PresenceService) {}

  @Post()
  create(@Body() createFichepresenceDto: CreateFichepresenceDto) {
    return this.fichepresenceService.create(createFichepresenceDto);
  }

  @Post("getbymonth")
  getFicheByMonth(@Body() monthDto: MonthDto) {
    return this.fichepresenceService.getByMonth(monthDto);
  }

  @Post("getbymonthandemploye")
  getFicheByMonthAndEmploye(@Body() monthDto: MonthDto & {employe: string}) {
    return this.fichepresenceService.getByMonthAndEmploye(monthDto);
  }

  @Get()
  findAll() {
    return this.fichepresenceService.findAll();    
  }

  @Get("/opened")
  findOpened() {
    return this.fichepresenceService.findOpened();
  }

  @Get('bycode/:code')
  findByCode(@Param('code')  code: string) {
    return this.fichepresenceService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichepresenceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFichepresenceDto: UpdateFichepresenceDto) {
    return this.fichepresenceService.update(id, updateFichepresenceDto);
  }

  @Patch('/toggle/:id')
  toggleState(@Param('id') id: string, @Body() updateStateDto: {isOpen: boolean}) {
    return this.fichepresenceService.toggleState(id, updateStateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichepresenceService.remove(id);
  }


}
