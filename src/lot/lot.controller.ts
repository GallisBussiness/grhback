import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LotService } from './lot.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { EmployeService } from 'src/employe/employe.service';
import { model } from 'mongoose';
import { FigurationSchema } from 'src/figuration/entities/figuration.entity';
import { Bulletin } from 'src/bulletin/entities/bulletin.entity';
import { AttributionGlobaleService } from 'src/attribution-globale/attribution-globale.service';
import { AttributionFonctionnelleService } from 'src/attribution-fonctionnelle/attribution-fonctionnelle.service';
import { ExclusionSpecifiqueService } from 'src/exclusion-specifique/exclusion-specifique.service';
import { differenceBy, round } from 'lodash';
import { AttributionGlobale } from 'src/attribution-globale/entities/attribution-globale.entity';
import { AttributionFonctionnelle } from 'src/attribution-fonctionnelle/entities/attribution-fonctionnelle.entity';
import { SECTIONNAME } from 'src/section/entities/section.entity';
import { Employe } from 'src/employe/entities/employe.entity';
import { intervalToDuration, parse } from 'date-fns';
import { AttributionIndividuelleService } from 'src/attribution-individuelle/attribution-individuelle.service';
import { ExclusionSpecifique } from 'src/exclusion-specifique/entities/exclusion-specifique.entity';
import { AttributionIndividuelle } from 'src/attribution-individuelle/entities/attribution-individuelle.entity';
import { NominationService } from 'src/nomination/nomination.service';
import { Nomination } from 'src/nomination/entities/nomination.entity';
import { ImpotService } from 'src/impot/impot.service';

@Controller('lot')
export class LotController {
  private figModel = model('Figuration',FigurationSchema);
  constructor(private readonly lotService: LotService,
    private readonly employeService: EmployeService,
    private readonly impotService: ImpotService,
    private readonly attributionGlobaleService: AttributionGlobaleService,
    private readonly attributionFonctionnelleService: AttributionFonctionnelleService,
    private readonly attributionIndividuelleService: AttributionIndividuelleService,
    private readonly exclusionSpecifiqueService: ExclusionSpecifiqueService,
    private readonly nominationService: NominationService
    ) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotService.create(createLotDto);
  }

  @Post('generatebulletin/:id')
  async generateBulletin(@Param('id') id: string) {
    const employes = await this.employeService.findActive();
    const attG = await this.attributionGlobaleService.findAll();
    const bulletins: Bulletin[] =[];
    for (let emp of employes){
       let bulletin:Bulletin = {employe: emp._id,lignes:{gains:[],retenues:[]},lot:id};
       let brut = 0;
       let ipres = 0;
       const {brut:b,ipres:i} = await this.determinationGains(emp,bulletin,brut,ipres,attG);
       await this.determinationRetenues(emp,bulletin,b,i,attG);
       bulletins.push(bulletin);
  }
   
  return bulletins;
}

  async determinationGains(emp: Employe,bulletin: Bulletin,brut: number,ipres: number,attG:AttributionGlobale[]){
    const idemp = emp._id.toString();
    const exclSpec = await this.exclusionSpecifiqueService.findByEmploye(idemp);
    const attrInd = await this.attributionIndividuelleService.findByEmploye(idemp);
    const nomActive  = await this.nominationService.findActiveByEmploye(idemp);
    
   const {brut:b,ipres:i} =  await this.attributionGlobales(emp,bulletin,brut,ipres,attG,exclSpec);
    const br = await this.attributionFonctionnelle(nomActive,b,bulletin,exclSpec);
    const {brut: brr,ipres:ii} = await this.attributionIndividuelle(emp,bulletin,br,ipres,attrInd)
  return {brut:brr,ipres:ii};
  }

  async determinationRetenues(emp:Employe,bulletin: Bulletin,brut: number,ipres: number,attG:AttributionGlobale[]){
    const exclSpec = await this.exclusionSpecifiqueService.findByEmploye(emp._id);
    const retenues = differenceBy(attG,exclSpec,(v) => v.rubrique._id.toString()).filter(v => v.rubrique.section.nom === SECTIONNAME.RETENUE);
    const m = await this.findImpot(brut,emp.nombre_de_parts);
    const t = await this.findTrimf(brut);
    retenues.forEach((r) => {
      const f = new this.figModel();
      // DETERMINATION IMPOT
      if(r.rubrique.code === 1080){
        f.base = brut;
        f.montant = m;
        f.taux1 = (f.montant / (brut === 0 ? 1 : 0)) * 100;
        f.taux2 = 0;
      }
       //DETERMINATION DU TRIMF
       else if(r.rubrique.code === 1999){
        f.base = brut;
        f.montant = t;
        f.taux1 = (f.montant / (brut === 0 ? 1 : 0)) * 100;
        f.taux2 = 0;
       }
      // DETERMINAtION DE IPRESS REGIME GENERALE
      else if(r.rubrique.code === 1000){
        ipres += brut;
        f.base = ipres >= 432000 ? 432000 : ipres;
        f.taux1 = 5.60;
        f.montant = round(f.base * f.taux1 / 100);
        f.taux2 = 8.40;
      }
      //DETEMINATION DE L'IPRES REGIME COMPLEMENTAIRE CADRE
      else if(r.rubrique.code === 1010){
        const n = parseInt(emp.categorie.code.toString()[0],10);
        if(n === 4){
         f.base = ipres >= 1296000 ? 1296000 : ipres;
         f.taux1 = 2.40;
         f.montant = round(f.base * f.taux1 / 100);
         f.taux2 = 3.60;
        }
      }
      // DETERMINATION DE LA CAISSE DE SECURITE SOCIALE
      // Accident du travail
      else if(r.rubrique.code === 1040){
        f.base = 63000;
        f.taux1 = 0;
        f.montant = round(f.base * f.taux1 / 100);
        f.taux2 = 1;
      }
      // Allocation familiale
      else if(r.rubrique.code === 1050){
        f.base = 63000;
        f.taux1 = 0;
        f.montant = round(f.base * f.taux1 / 100);
        f.taux2 = 7;
      }
      else {
        f.base = r.valeur_par_defaut;
        f.montant = r.valeur_par_defaut;
        f.taux1 = 100;
      }
      f.rubrique = r.rubrique;
      bulletin.lignes['retenues'].push(f);
    })
    // RETENUES INDIVIDUELLES

    const attrInd = await this.attributionIndividuelleService.findByEmploye(emp._id);
    const ri = attrInd.filter(a => a.rubrique.section.nom === SECTIONNAME.RETENUE);
    ri.forEach(r => {
      const f = new this.figModel();
      // FOND NATIONAL DE RETRAITE
      if(r.rubrique.code === 1013) {
        ipres += brut;
        f.base = ipres >= 432000 ? 432000 : ipres;
        f.taux1 = 12;
        f.rubrique = r.rubrique;
        f.montant = round(f.base * f.taux1 / 100);
        f.taux2 = 23;
        bulletin.lignes['retenues'].push(f);
      }
    })
    return {brut,ipres};
  }

  async attributionGlobales(emp: Employe,bulletin: Bulletin,brut: number,ipres: number,attG:AttributionGlobale[],exclSpec: ExclusionSpecifique[]){
    const diff = differenceBy(attG,exclSpec,(v) => v.rubrique._id.toString()).filter(v => v.rubrique.section.nom != SECTIONNAME.RETENUE);
    diff.forEach(a => {
      const f = new this.figModel();

      //DETERMINATION DU SALAIRE DE BASE
      if(a.rubrique.code === 10){
        f.base = emp.categorie.valeur;
        f.montant = emp.categorie.valeur;
      }
      // RAPPEL AUGMENTATION SOLDE GLOBAL
      else if(a.rubrique.code === 321){
        const vn = emp.categorie.valeur;
        const va = vn / 1.05;
        const e = vn - va;
        const r = e * 8;
        f.base = e;
        f.montant = r;
      }
      //DETERMINATIsON DE L'AUGEMENTATION SOLDE AVANT 2000
      else if(a.rubrique.code === 1451){
        const r = parseInt(emp.categorie.code.toString().substring(0,1),10);
        if(r=== 1){
          f.montant = 23515;
        }
        else if(r === 2){
          f.montant = 24515;
        }
        else if(r===3){
          f.montant = 25015;
        }
        else {
          f.montant = 26015;
        }
      }
      // DETERMINATION AUGMENTATION SOLDE 2000
      else if(a.rubrique.code === 1453){
        const r = parseInt(emp.categorie.code.toString().substring(0,1),10);
        if(r=== 1){
          f.montant = 5456;
        }
        else if(r === 2){
          f.montant = 5676;
        }
        else if(r===3){
          f.montant = 6294;
        }
        else {
          f.montant = 7633;
        }
        ipres += f.montant;
      }

      // DETERMINATION AUGMENTATION SOLDE JANVIER 2002
      else if(a.rubrique.code === 1455){
        const r = parseInt(emp.categorie.code.toString().substring(0,1),10);
        if(r=== 1){
          f.montant = 9000;
          }
          else {
            f.montant = 10000;
            }
      ipres += f.montant;      
      }
      // PRIME ASSUIDITE
      else if(a.rubrique.code === 30){
        const anciennete = this.getAnciennete(emp.date_de_recrutement);
        const vCat = emp.categorie.valeur;
        let value = 0;
        if(anciennete < 2){
          value = 0;
        }
        else if(anciennete < 6){
          value = (vCat * anciennete) / 100;
        }
        else if(anciennete < 31){
          value = (vCat * (anciennete + 3)) / 100;
        }
        else {
          value = (vCat * 33)/100;
          f.base = vCat;
          f.montant = value;
        }
      }
      else {
        f.montant = a.valeur_par_defaut;
      }
      f.rubrique = a.rubrique;
      if(a.rubrique.section.nom === SECTIONNAME.IMPOSABLE) {
        brut += f.montant;
      }
      if(!((a.rubrique.code === 30) && (f.montant === 0))){
        bulletin.lignes['gains'].push(f);
      }
      
    });
    return {brut,ipres};
  }
  async attributionFonctionnelle(nomActive: Nomination[],brut:number,bulletin:Bulletin,exclSpec: ExclusionSpecifique[]){
    nomActive.forEach(async (n) =>{
        const attrFonc = await this.attributionFonctionnelleService.findByFonction(n.fonction._id.toString());
        const gains = differenceBy(attrFonc,exclSpec,(v) => v.rubrique._id.toString()).filter(v => v.rubrique.section.nom != SECTIONNAME.RETENUE);
        gains.forEach(g => {
          const f = new this.figModel();
          f.base = g.valeur_par_defaut;
          f.montant = g.valeur_par_defaut;
          f.rubrique = g.rubrique;
          if(g.rubrique.section.nom === SECTIONNAME.IMPOSABLE){
            brut += f.montant;
          }
          bulletin.lignes['gains'].push(f)
        })
    })
    return brut;
  }

  async attributionIndividuelle(emp: Employe,bulletin: Bulletin,brut: number,ipres: number,attrInd: AttributionIndividuelle[]){
    const gains = attrInd.filter(a => a.rubrique.section.nom !== SECTIONNAME.RETENUE);
    const f = new this.figModel();
    gains.forEach(g => {
      // INDEMNITE D ENSEIGNEMENT
      if(g.rubrique.code === 145 ){
        f.base = emp.categorie.valeur;
        f.taux1= 50;
        f.montant = round(f.base * 50 / 100);
      }
      //INDEMNITE DE RECHERCHE
      else if(g.rubrique.code === 148){
        f.base =emp.categorie.valeur;
        f.taux1 = 105;
        f.montant = round(f.base * 105 / 100);
      }
      // COMPLEMENT SPECIAL
      else if(g.rubrique.code === 109){
        f.base =emp.categorie.valeur;
        f.taux1 = 20;
        f.montant = round(f.base * 20 / 100);
      }
      //INDEMNITE RESIDENCE
      else if(g.rubrique.code === 113){
        f.base =emp.categorie.valeur;
        f.taux1 = 14;
        f.montant = round(f.base * 14 / 100);
      }
      else {
        f.montant = g.valeur_par_defaut;
        f.base = g.valeur_par_defaut;
      }
      f.rubrique = g.rubrique;
      if(g.rubrique.section.nom === SECTIONNAME.IMPOSABLE){
        brut += f.montant;
      }
      bulletin.lignes['gains'].push(f);
    })
    
    return {brut,ipres};
  }

  getAnciennete(recrutement: string){
    const rd = parse(recrutement,"yyyy-MM-dd",new Date());
    const diff = intervalToDuration({start: rd,end: Date.now()}).years
    return diff;
  }

  async findImpot(brut: number,parts: number){
    const impot = await this.impotService.findOneByVal(brut);
    let value = 0;
    if(impot) {
     if(parts === 1){
      value = impot.p1;
     }
     else if(parts === 1.5){
      value = impot.p2;
     }
     else if(parts === 2){
      value = impot.p3;
     }
     else if(parts === 2.5){
      value = impot.p4;
      }
      else if(parts === 3){
        value = impot.p5;
        }
        else if(parts === 3.5){
          value = impot.p6;
          }
          else if(parts === 4){
            value = impot.p7;
            }
            else if(parts === 4.5){
              value = impot.p8;
              }
              else if(parts === 5){
                value = impot.p9;
                }
    }
    return value;
  }

  async findTrimf(brut:number){
    const impot = await this.impotService.findOneByVal(brut);
    return impot ? impot.trimf : 0;
  }

  @Get()
  findAll() {
    return this.lotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotDto: UpdateLotDto) {
    return this.lotService.update(id, updateLotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotService.remove(id);
  }
}
