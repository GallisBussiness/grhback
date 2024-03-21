import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FichepresenceService } from './fichepresence.service';
import { CreateFichepresenceDto } from './dto/create-fichepresence.dto';
import { UpdateFichepresenceDto } from './dto/update-fichepresence.dto';
import { PresenceService } from 'src/presence/presence.service';
import { MonthDto } from './dto/month.dto';
import { TYPEPRESENCE } from 'src/presence/dto/create-presence.dto';
import { EmployeService } from 'src/employe/employe.service';
import { intervalToDuration, parseISO } from 'date-fns';
import { padStart } from 'lodash';

@Controller('fichepresence')
export class FichepresenceController {
  constructor(private readonly fichepresenceService: FichepresenceService,private readonly presenceService: PresenceService,
    private readonly employeService: EmployeService) {}

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
    monthDto.mois = padStart(monthDto.mois,2,"0");
    return this.fichepresenceService.getByMonthAndEmploye(monthDto);
  }

  @Get()
  findAll() {
    return this.fichepresenceService.findLast();    
  }

  @Post('/byweek')
  async findWeek(@Body() weekDto: {start: string, end: string,mois: string}) {
    const employees = await this.employeService.findAll();
    const r = [];
    const fiches = await this.fichepresenceService.findWeek(weekDto.start,weekDto.end,weekDto.mois);
    const presences  = await Promise.all(fiches.map(async (f) => {
      const p = await  this.presenceService.findByFiche(f._id.toString());
      return {fiche: f.date,description:f.description,code: f.code,_id: f._id, presences : p}
    }))
    employees.forEach(e => {
      const o = {employe: e, presences:[],heures:0};
      presences.forEach(p => {
            const arrive  = p.presences.find((x)=> x.type === TYPEPRESENCE.ARRIVEE && x.employe._id.toString() === e._id.toString());
            const depart  = p.presences.find((x)=> x.type === TYPEPRESENCE.DEPART && x.employe._id.toString() === e._id.toString());
            o.presences.push({date:p.fiche,arrive,depart});
      });
      o.heures= o.presences.reduce((acc, cur) => {
       if((cur.hasOwnProperty("arrive") && cur?.arrive?.heure) && (cur.hasOwnProperty("depart") && cur?.depart?.heure)){
       return acc + intervalToDuration({start : new Date(cur.arrive.heure), end : new Date(cur.depart.heure)}).hours;
       }
      return acc + 0;
      },0);
      r.push(o);
    });
    
    return r; 
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
