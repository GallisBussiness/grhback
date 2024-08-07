import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
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
import { differenceBy, flatten, round } from 'lodash';
import { AttributionGlobale } from 'src/attribution-globale/entities/attribution-globale.entity';
import { SECTIONNAME } from 'src/section/entities/section.entity';
import { Employe } from 'src/employe/entities/employe.entity';
import { intervalToDuration, parse } from 'date-fns';
import { AttributionIndividuelleService } from 'src/attribution-individuelle/attribution-individuelle.service';
import { ExclusionSpecifique } from 'src/exclusion-specifique/entities/exclusion-specifique.entity';
import { AttributionIndividuelle } from 'src/attribution-individuelle/entities/attribution-individuelle.entity';
import { NominationService } from 'src/nomination/nomination.service';
import { Nomination } from 'src/nomination/entities/nomination.entity';
import { ImpotService } from 'src/impot/impot.service';
import { PdfMaker } from './helpers/pdf.maker';
import { RegistreService } from 'src/registre/registre.service';
import { glob } from 'glob';
import { unlinkSync } from 'fs';
import { CheckAbility } from 'src/casl/policy.decorator';
import { Action } from 'src/casl/casl-ability.factory';
import { Lot } from './entities/lot.entity';
import { AuthGuard } from '@nestjs/passport';
import { CaslGuard } from 'src/casl/casl.guard';

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
    private readonly nominationService: NominationService,
    private readonly registreService: RegistreService
    ) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotService.createLot(createLotDto);
  }

  @Post('generatebulletin/:id')
  async generateBulletin(@Param('id') id: string) {
    const pdf = new PdfMaker();
    const [lot,employes,attG] = await Promise.all([this.lotService.findOne(id),this.employeService.findActive(),this.attributionGlobaleService.findAll()])
    const bulletins: Bulletin[]=[];
    for (let emp of employes){
       let bulletin:Bulletin = {employe: emp,lignes:{gains:[],retenues:[]},lot};   let brut = 0;
       let ipres = 0;
       let fnr = 0;
       
       const {brut:b,ipres:i,fnr:f} = await this.determinationGains(emp,bulletin,brut,fnr,ipres,attG);
       await this.determinationRetenues(emp,bulletin,b,i,f,attG); 
       bulletins.push(bulletin);
  }
  let curR = await this.registreService.findByAnneeAndMois(lot.annee,lot.mois);
  if(curR){
    await this.registreService.update(curR._id,{bulletins});
  }else {
    curR = await this.registreService.create({lot: lot._id.toString(),annee:lot.annee,mois:lot.mois,bulletins});
  }
  const prevReg = await this.registreService.findByAnneeAndOldMois(lot.annee,lot.mois);
  const idReg   = curR._id.toString();
  bulletins.forEach(b => {
    const olds = [];
    prevReg.forEach(r => {
      olds.push(r?.bulletins?.filter(bu => bu.employe['_id'].toString() === b.employe['_id'].toString()) ?? [])
    })
    try {
    pdf.make(b,flatten(olds),idReg);
  } catch (error) {
    throw new HttpException(error.message,500);
  }
  })
  try {
     pdf.makeAll(bulletins,lot,idReg,prevReg);
  } catch (error) {
    throw  new HttpException(error.message,500);
  }
 
  return `uploads/bulletins/${lot._id.toString()}-${lot.mois}-${lot.annee}.pdf`;
}

  async determinationGains(emp: Employe,bulletin: Bulletin,brut: number,fnr:number,ipres: number,attG:AttributionGlobale[]){
    const idemp = emp._id.toString();
    const [exclSpec,attrInd,nomActive] = await Promise.all(
      [this.exclusionSpecifiqueService.findByEmploye(idemp),
      this.attributionIndividuelleService.findByEmploye(idemp),
      this.nominationService.findActiveByEmploye(idemp)
    ]);

    
   
   const {brut:b,ipres:i,fnr:f} =  await this.attributionGlobales(emp,bulletin,brut,fnr,ipres,attG,exclSpec);
    const br = await this.attributionFonctionnelle(nomActive,b,bulletin,exclSpec);
    const {brut: brr,ipres:ii} = await this.attributionIndividuelle(emp,bulletin,br,i,attrInd);
  return {brut:brr,ipres:ii,fnr:f};
  }

  async determinationRetenues(emp:Employe,bulletin: Bulletin,brut: number,ipres: number,fnr:number,attG:AttributionGlobale[]){
    const bi = brut + ipres;
    const exclSpec = await this.exclusionSpecifiqueService.findByEmploye(emp._id.toString());
    const retenues = differenceBy(attG,exclSpec,(v) => v.rubrique._id.toString()).filter(v => v.rubrique.section.nom === SECTIONNAME.RETENUE);
    const [m,t] = await Promise.all([
      this.findImpot(brut,emp.nombre_de_parts),
      this.findTrimf(brut)
    ])
    retenues.forEach((r) => {
      const f = new this.figModel();
      // DETERMINATION IMPOT
      if(r.rubrique.code === 1080){
        f.base = brut;
        f.montant = m;
        f.taux1 = round((f.montant / (brut === 0 ? 1 : brut)) * 100,2);
        f.taux2 = 0;
      }
       //DETERMINATION DU TRIMF
       else if(r.rubrique.code === 1999){
        f.base = brut;
        f.montant = t;
        f.taux1 = round((f.montant / (brut === 0 ? 1 : brut)) * 100,2);
        f.taux2 = 0;
       }
      // DETERMINAtION DE IPRESS REGIME GENERALE
      else if(r.rubrique.code === 1000){
        f.base = bi >= 432000 ? 432000 : bi;
        f.taux1 = 5.60;
        f.montant = round(f.base * f.taux1 / 100);
        f.taux2 = 8.40;
      }
      
      //DETEMINATION DE L'IPRES REGIME COMPLEMENTAIRE CADRE
      else if((r.rubrique.code === 1010) && (parseInt(emp.categorie.code.toString()[0],10) === 4 || emp.categorie.code === 11)){
         f.base = bi >= 1296000 ? 1296000 : bi;
         f.taux1 = 2.40;
         f.montant = round(f.base * f.taux1 / 100);
         f.taux2 = 3.60;
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
      const {section,code,libelle} = r.rubrique;
      f.rubrique = {section: {nom:section.nom},code,libelle};
      if(r.rubrique.code === 1010){
          if(parseInt(emp.categorie.code.toString()[0],10) === 4 || emp.categorie.code === 11){
            bulletin.lignes['retenues'].push(f);
          }
      }
      else {
        bulletin.lignes['retenues'].push(f);
      }
    })
    // RETENUES INDIVIDUELLES

    const attrInd = await this.attributionIndividuelleService.findByEmploye(emp._id.toString());
    const ri = attrInd.filter(a => a.rubrique.section.nom === SECTIONNAME.RETENUE);
    ri.forEach(r => {
      const f = new this.figModel();
     // DETERMINAtION DE FOND NATIONAL DE RETRAITE
     if(r.rubrique.code === 1013){
      //salaire de base + indem enseignement 145 + com spec 109 + indem residence 113 + les 3 augs
      // taux1 = 12
      // taux2 = 23
      // 145 => base = salaire de base, taux1 = 50
      // 109 => base = salaire de base, taux1 = 20
      // 113 => base = salaire de base, taux1 = 14
      f.base = emp.categorie.valeur + fnr;
      f.taux1 = 12;
      f.montant = round(f.base * f.taux1 / 100);
      f.taux2 = 23;
    }
    else {
      f.base = r.valeur_par_defaut;
      f.montant = r.valeur_par_defaut;
    }
    const {section,code,libelle} = r.rubrique;
    f.rubrique = {section: {nom:section.nom},code,libelle};
    bulletin.lignes['retenues'].push(f);
    })
    return {brut,ipres,fnr};
  }

  async attributionGlobales(emp: Employe,bulletin: Bulletin,brut: number,fnr: number,ipres: number,attG:AttributionGlobale[],exclSpec: ExclusionSpecifique[]){
    const diff = differenceBy(attG,exclSpec,(v) => v.rubrique._id.toString()).filter(v => v.rubrique.section.nom !== SECTIONNAME.RETENUE);
    diff.forEach(a => {
      const f = new this.figModel();

      //DETERMINATION DU SALAIRE DE BASE
      if(a.rubrique.code === 10){
        f.base = emp.categorie.valeur;
        f.montant = emp.categorie.valeur;
      }

      // 145 => base = salaire de base, taux1 = 50
      else if(a.rubrique.code === 145){
        f.base = emp.categorie.valeur;
        f.taux1 = 50;
        f.montant = round(f.base * f.taux1 / 100);
        fnr += f.montant;
      }

      else if(a.rubrique.code === 109){
        f.base = emp.categorie.valeur;
        f.taux1 = 20;
        f.montant = round(f.base * f.taux1 / 100);
        fnr += f.montant;
      }

      else if(a.rubrique.code === 113){
        f.base = emp.categorie.valeur;
        f.taux1 = 14;
        f.montant = round(f.base * f.taux1 / 100);
        fnr += f.montant;
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
        ipres += f.montant;
        fnr += f.montant;
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
        fnr += f.montant;
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
      fnr += f.montant;      
      }
      // PRIME ASSUIDITE
      else if(a.rubrique.code === 30){
        const anciennete = this.getAnciennete(emp.date_de_recrutement);
        const vCat = emp.categorie.valeur;
        let value = 0;
        let aug2000 = 0;
        const r = parseInt(emp.categorie.code.toString().substring(0,1),10);
              if(r=== 1){
                aug2000 = 5456;
              }
              else if(r === 2){
                aug2000 = 5676;
              }
              else if(r===3){
                aug2000 = 6294;
              }
              else {
                aug2000 = 7633;
              }

                if(anciennete < 2){
                  value = 0;
                }
                else if(anciennete < 6){
                  value = ((vCat + aug2000) * anciennete) / 100;
                }
                else if(anciennete < 31){
                  value = ((vCat + aug2000) * (anciennete + 3)) / 100;
                }
                else {
                  value = ((vCat + aug2000) * 33)/100;
                }
                f.base = (vCat + aug2000);
                f.montant = round(value);
              }
      else {
        f.montant = a.valeur_par_defaut;
      }
      
      const {section,code,libelle} = a.rubrique;
      f.rubrique = {section: {nom:section.nom},code,libelle};
      if(a.rubrique.section.nom === SECTIONNAME.IMPOSABLE) {
        brut += f.montant;
      }
      if(!(code === 30 && f.montant === 0)){
        bulletin.lignes['gains'].push(f);
      }
      
    });
    return {brut,ipres,fnr};
  }
  async attributionFonctionnelle(nomActive: Nomination[],brut:number,bulletin:Bulletin,exclSpec: ExclusionSpecifique[]){
    await Promise.all(nomActive.map(async (n) =>{
        const attrFonc = await this.attributionFonctionnelleService.findByFonction(n.fonction._id.toString());
        const gains = differenceBy(attrFonc,exclSpec,(v) => v.rubrique._id.toString()).filter(v => v.rubrique.section.nom !== SECTIONNAME.RETENUE);
        gains.forEach(g => {
          const f = new this.figModel();
          f.base = g.valeur_par_defaut;
          f.montant = g.valeur_par_defaut;
          const {section,code,libelle} = g.rubrique;
          f.rubrique = {section: {nom:section.nom},code,libelle};
          
          if(g.rubrique.section.nom === SECTIONNAME.IMPOSABLE){
            brut += f.montant;
          }
          bulletin.lignes['gains'].push(f)
        })
        return n;
    }))
    return brut;
  }

  async attributionIndividuelle(emp: Employe,bulletin: Bulletin,brut: number,ipres: number,attrInd: AttributionIndividuelle[]){
    const gains =  attrInd.filter(a => a.rubrique.section.nom !== SECTIONNAME.RETENUE);

    gains.forEach(g => {
      const f = new this.figModel();
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
      const {section,code,libelle} = g.rubrique;
      f.rubrique = {section: {nom:section.nom},code,libelle};
      if(g.rubrique.section.nom === SECTIONNAME.IMPOSABLE){
        brut += f.montant;
      }
      bulletin.lignes['gains'].push(f);
    })
    return {brut,ipres};
  }

  getAnciennete(recrutement: string){
    let rd:any;
    if(recrutement.includes('/')){
      rd = parse(recrutement,"yyyy/MM/dd",new Date());
    }else {
      rd = parse(recrutement,"yyyy-MM-dd",new Date());
    }
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

  @Get('getbulletins/:id')
  async findBulletin(@Param('id') id: string) {
    const lotValide = await this.lotService.findAllValide();
    let files = [];
    await Promise.all(lotValide.map(async (l:Lot) => {  
      if(l.isPublished) {
         const fils = await glob(`uploads/bulletins/${l._id.toString()}-${id}-*.pdf`);
         files = [...files, ...fils];
         return fils;
      }
    }))
    
    return files;
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

  @CheckAbility({ action: Action.Delete, subject: Lot })
  @UseGuards(AuthGuard('jwt'), CaslGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const lot = await this.lotService.remove(id);
    await this.registreService.removeByLot(id);
    const files = await  glob(`uploads/bulletins/${id}-*.pdf`);
    files.forEach(f => unlinkSync(`${f}`));
    return lot;
  }
}
