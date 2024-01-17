import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { UpdatePresenceDto } from './dto/update-presence.dto';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post("arrive")
  arrive(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presenceService.createArrive(createPresenceDto);
  }

  @Post("depart")
  depart(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presenceService.createDepart(createPresenceDto);
  }

  @Get()
  findAll() {
    return this.presenceService.findAll();
  }

  @Get('byfiche/:fiche')
  findByFiche(@Param('fiche') fiche: string) {
    return this.presenceService.findByFiche(fiche);
  }

  @Get('by/:fiche/:employe')
  findByFicheAndEmploye(@Param('fiche') fiche: string,@Param('employe') employe: string) {
    return this.presenceService.findByFicheAndEmploye(fiche,employe);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presenceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresenceDto: UpdatePresenceDto) {
    return this.presenceService.update(id, updatePresenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presenceService.remove(id);
  }
}
