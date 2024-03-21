import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotstempService } from './lotstemp.service';
import { CreateLotstempDto } from './dto/create-lotstemp.dto';
import { UpdateLotstempDto } from './dto/update-lotstemp.dto';
import { RegistretempService } from 'src/registretemp/registretemp.service';
import { TemporaireService } from 'src/temporaire/temporaire.service';
import { PdfMaker } from './helpers/pdf.maker';
import { StatusService } from 'src/status/status.service';

@Controller('lotstemp')
export class LotstempController {
  constructor(private readonly lotstempService: LotstempService,
    private readonly registretempService: RegistretempService,
    private readonly temporaireService: TemporaireService,
    private readonly statusService:  StatusService,
    ) {}

  @Post()
  create(@Body() createLotstempDto: CreateLotstempDto) {
    return this.lotstempService.createLot(createLotstempDto);
  }

  @Post('generatebulletin/:id')
  async generateBulletin(@Param('id') id: string) {
    const pdf = new PdfMaker();
    const [lot,temps,status] = await Promise.all([
      this.lotstempService.findOne(id),
      this.temporaireService.findAll(),
      this.statusService.findAll()
    ]);

    const total = temps.reduce((acc,cur) => acc + cur.mensualite,0);
    
  let curR = await this.registretempService.findByAnneeAndMois(lot.annee,lot.mois);
  if(curR){
    await this.registretempService.update(curR._id,{total});
  }else {
    curR = await this.registretempService.create({lot: lot._id,annee:lot.annee,mois:lot.mois,total});
  }
  const prevReg = await this.registretempService.findByAnneeAndOldMois(lot.annee,lot.mois);

  pdf.generate(temps,status,lot);
  return `uploads/bulletins/temporaires/${lot._id}-${lot.mois}-${lot.annee}.pdf`;
}

  @Get()
  findAll() {
    return this.lotstempService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotstempService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotstempDto: UpdateLotstempDto) {
    return this.lotstempService.update(id, updateLotstempDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotstempService.remove(id);
  }
}
