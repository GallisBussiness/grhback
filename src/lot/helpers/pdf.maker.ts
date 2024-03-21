import { createWriteStream } from "fs";
import PdfPrinter from 'pdfmake';
import { Bulletin } from "src/bulletin/entities/bulletin.entity";
import { Lot } from "../entities/lot.entity";
import { Employe } from "src/employe/entities/employe.entity";
import { Calcul } from "./calcul";
import { Registre } from "src/registre/entities/registre.entity";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { flatten } from "lodash";


const fonts = {
  TmesNewRoman: {
    normal: 'src/lot/helpers/font/TimesNewRoman/timesnewroman.ttf',
    bold: 'src/lot/helpers/font/TimesNewRoman/timesnewromanbold.ttf',
    italics: 'src/lot/helpers/font/TimesNewRoman/timesnewromanitalic.ttf',
    bolditalics: 'src/lot/helpers/TimesNewRoman/timesnewromanbolditalic.ttf'
  },
  Roboto: {
          normal: 'src/lot/helpers/font/roboto-font/Roboto-Regular.ttf',
          bold: 'src/lot/helpers/font/roboto-font/Roboto-Medium.ttf',
          italics: 'src/lot/helpers/font/roboto-font/Roboto-Italic.ttf',
          bolditalics: 'src/lot/helpers/roboto-font/font/Roboto-MediumItalic.ttf'
        }
};

const formatNumber = (n: number) => String(n).replace(/(.)(?=(\d{3})+$)/g,'$1 ');

export class PdfMaker {
    private printer = new PdfPrinter(fonts);


  make(bulletin: Bulletin,olds:Bulletin[],idReg: string){
            
           const {mois,annee,debut,fin,etat,_id:idlot} = bulletin.lot as Lot;
          const employe = bulletin.employe as Employe;
          const cal = new Calcul();
          const debutStr = format(parse(debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr});
          const finStr = format(parse(fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr});
          const anneeStr = format(parse(debut,'yyyy-MM-dd',new Date()),'MMMM',{locale:fr}).toUpperCase();
          const wm = etat === "VALIDE" ? annee : "BROUILLON"
          const totauxAnnuels = cal.getTotauxAnnuel([...olds,bulletin]);
          const  docDefinition = {
            footer: function() { return {text:'DANS VOTRE INTERET ET POUR VOUS AIDER A FAIRE VALOIR VOS DROITS, CONSERVER CE BULLETIN DE PAIE SANS LIMITATION DE DUREE',fontSize:6,alignment:'center',italics: true}},
            watermark: { text: `Bulletin CROUS/Z ${wm}`, color: etat === "VALIDE" ? 'grey':'red', opacity: 0.1, bold: true, italics: false },
          content: [
            {
              columns: [
                {
                with: '20%',
                alignment:'left',
                stack: [
                  {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
                  {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
                  {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
                  {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
                  {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
                  {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
                  {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
                ]},

                { qr: `${idReg}:${bulletin.employe['_id'].toString()}`,fit:80,alignment:'center',eccLevel:'M' },
                
                {
                  with:'20%',
                  alignment:'right',
                  stack:[
                    {image:'src/lot/helpers/logo.png',width: 80,margin:[10,2]},
                    {text: `Du ${debutStr} Au ${finStr}`,fontSize: 6,bold: true}
                  ]
                  
                }
              ]
            },
            {
              margin: [6,15],
              fillColor:"#73BFBA",
              alignment:'center',
              layout:'noBorders',
              table: {
                widths: [500],
                body: [
                  [ {text:"BULLETIN DE PAIE",fontSize: 16,bold: true,color:'white',margin:[0,2]}],
                ]
              }
            },
            {
              columns:[
               {
                with: 'auto',
                alignment:'left',
                fontSize:6,
                italics:true,
               text:`Convention Collective. CONVENTION ETS PUBLICS\n`
               },
               {
                with: 'auto',
                alignment:'right',
                fontSize:6,
                italics:true,
                text:`BULLETINS DU MOIS DE ${anneeStr}\n`
                }
              ]
            },
            {
                columns:[
                 {
                    alignment:'left',
                    margin: [10,0],
                    layout:'noBorders',
                    table: {
                body: [
                  [{text:'Prenom et Nom :',style:'info'}, {text:`${employe.prenom} ${employe.nom}`,fontSize: 6}],
                  [{text:'Matricule de Solde :',style:'info'}, {text:`${employe.matricule_de_solde}`,fontSize: 6}],
                  [{text:'Emploi :',style:'info'}, {text:`${employe.poste}`,fontSize:6}],
                  [{text:'Nombre de parts :',style:'info'}, {text:`${employe.nombre_de_parts}`,fontSize: 6}],
                  [{text:'Contrat :',style:'info'}, {text:`${employe.type}`,fontSize:6}],
                ]
              }
                 },
                 {
                    alignment:'left',
                    margin: [10,0],
                    layout:'noBorders',
                    table: {
                body: [
                  [{text:'Catégorie :',style:'info'}, {text:`${employe.categorie.code}`,fontSize:6}],
                  [{text:'Coefficient Horaire :',style:'info'}, {text:'173,33',fontSize:6}],
                            [{text:'Ancienneté :',style:'info'}, {text:cal.getAnciennete(employe.date_de_recrutement),fontSize:6}],
                            [{text:'Date de Recrutement :',style:'info'}, {text:format(parse(employe.date_de_recrutement,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr}),fontSize:6}]
                ]
              }
                  }
                ]
              },
              {
                margin: [2,5,0,0],
                alignment:'center',
                fillColor:'white',
                table: {
                    widths: ['*',150, '*', '*', '*',5,50,'*'],
                          body: [
                              [{text:'',border:[false,false,false,false]}, {text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},''],
                          ]
                      }
              },
            {
            margin: [2,0,0,2],
              layout: {
                fillColor:(i,node) => {
                    return i % 2 === 0 ? '#f5f5dc' : 'white';
                }
              },
              table: {
                widths: ['*',150, '*', '*', '*',5,50,'*'],
                headerRows: 1,
              body: [
                [{text:'#',style:'header'},{text:'Rubriques',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
                ...cal.imposable(bulletin.lignes['gains']).sort((l,r) => l.rubrique.code - r.rubrique.code).map((a,i) => {
                    if(i === 0){
                        return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
                    }
                     return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(Math.round(a.base)) || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? formatNumber(Math.round(Math.round(a.taux2 * a.base / 100))) : '',style:'nombre',border:[false,false,true,false]}]
                }),
                [{text:'Total Brut',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(cal.totalImposable),style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:formatNumber(cal.tppi) || '',style:'total',colSpan:2},''],
              ]
            }
            },
            {
                margin: [2,0,0,2],
                layout: {
                    fillColor:(i,node) => {
                        return i % 2 === 0 ? '#f5f5dc' : 'white';
                    }
                },
                table: {
                    widths: ['*',150, '*', '*', '*',5,50,'*'],
                    headerRows: 1,
                  body: [
                    ...cal.retenues(bulletin.lignes['retenues']).sort((l,r) => l.rubrique.code - r.rubrique.code).map((a,i) => {
                      if(i === 0){
                        return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(Math.round(a.base)) || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(Math.round(a.montant)),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? formatNumber(Math.round(Math.round(a.taux2 * a.base / 100))) : '',style:'nombre',border:[false,true,true,false]}]
                    }
                     return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(Math.round(a.base)) || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(Math.round(a.montant)),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? formatNumber(Math.round(Math.round(a.taux2 * a.base / 100))) : '',style:'nombre',border:[false,false,true,false]}]
                    }),
                    [{text:'Total Retenues',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(cal.totalRetenue),style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:formatNumber(cal.tppr) || '',style:'total',colSpan:2},'']
                  ]
                }
            },
            {
                margin: [2,0,0,2],
                layout: {
                    fillColor:(i,node) => {
                        return i % 2 === 0 ? '#f5f5dc' : 'white';
                    }
                },
                table: {
                    widths: ['*',150, '*', '*', '*',5,50,'*'],
                    headerRows: 1,
                  body: [
                    ...cal.nonimposable(bulletin.lignes['gains']).sort((l,r) => l.rubrique.code - r.rubrique.code).map((a,i) => {
                      if(i === 0){
                        return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(Math.round(a.base)) || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
                    }
                     return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
                    }),
                    [{text:'Total Non Imposable',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(cal.totalNomImposable),style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:formatNumber(cal.tppni) || '',style:'total',colSpan:2},'']
                  ]
                }
            },
            {
                margin: [2,0,0,2],
                table: {
                    widths: ['*', '*', '*', '*','*',80],
                    headerRows: 1,
                  body: [
                    [{text:'Totaux',style:'header3'}, {text: 'Brut',style:'header3'}, {text:'Charges Salariale',style:'header3'},{text:'Charges Patronales',style: 'header3'},{text:'Avantages',style:'header3'},{text:'Net A Payer',style:'header3'}],
                    [{text:'Totaux Mensuels',style:'header2'}, {text: formatNumber(cal.totalImposable),style:'nombre'}, {text:formatNumber(cal.totalRetenue),style:'nombre'},{text: formatNumber(cal.totalPp),style: 'nombre'},{text:formatNumber(cal.totalNomImposable),style: 'nombre'},{text:formatNumber(cal.totalImposable + cal.totalNomImposable - cal.totalRetenue),style: 'nombre'}],
                    [{text:'Totaux Annuels',style:'header2'},{text: formatNumber(totauxAnnuels.totalIm),style:'nombre'}, {text:formatNumber(totauxAnnuels.totalRet),style:'nombre'},{text:formatNumber(totauxAnnuels.totalPP),style: 'nombre'},{text:formatNumber(totauxAnnuels.totalNI),style: 'nombre'},{text:formatNumber(totauxAnnuels.nap),style: 'nombre'}],
        
                  ]
                }
            }
            
          ],
          styles: {
            header: {
                color:"white",
                border: [true, true, true, true],
                fillColor: '#73BFBA',
                bold: true,
                alignment:'center',
                fontSize:6
            },
            header2: {
                alignment:'left',
                fontSize:6,
                bold:true,
            },
            nombre: {
              alignment:'right',
              fontSize:6,
              bold: true
          },
             info: {
              fontSize:6,
          },
            header3: {
                color:"white",
                fillColor: '#73BFBA',
                bold: true,
                alignment:'center',
                fontSize:6,
            },
            header4: {
              color:"white",
              fillColor: '#73BFBA',
              bold: true,
              alignment:'right',
              fontSize:6
          },
            total:{
                color:"white",
                bold: true,
                fontSize:6,
                fillColor:'#73BFBA',
                alignment:'center'
            },
            anotherStyle: {
              italics: true,
              alignment: 'right'
            }
          }
        };
        const options = {};
          const pdfDoc = this.printer.createPdfKitDocument(docDefinition, options);
          pdfDoc.pipe(createWriteStream(`uploads/bulletins/${idlot}-${employe._id}-${mois}-${annee}.pdf`));
          pdfDoc.end();
    }

    makeAll(bulletins: Bulletin[],lot: Lot,idReg: string,prevR:Registre[] | null){
      const grandeLigne = [];
      let totalGrandeLigne = {brut:0,retenues:0,avantages:0,nap:0};
      const cal2 = new Calcul();
      const {mois,annee,etat,_id} = lot;
      const wm = etat === "VALIDE" ? annee : "BROUILLON"
      const docDefinition = {
        footer: function(currentPage, pageCount) { return {text:'DANS VOTRE INTERET ET POUR VOUS AIDER A FAIRE VALOIR VOS DROITS, CONSERVER CE BULLETIN DE PAIE SANS LIMITATION DE DUREE',fontSize:6,alignment:'center', italics: true}},
        watermark: { text: `Bulletin CROUS/Z ${wm}`, color: etat === "VALIDE" ? 'grey':'red', opacity: 0.3, bold: true, italics: false },
        content:[],
        styles: {
          header: {
              color:"white",
              border: [true, true, true, true],
              fillColor: '#73BFBA',
              bold: true,
              alignment:'center',
              fontSize:6
          },
          header2: {
              alignment:'left',
              fontSize:6,
             bold:true
          },
          nombre: {
            alignment:'right',
            fontSize:6,
            bold:true
        },
           info: {
            fontSize:6,
        },
          header3: {
              color:"white",
              fillColor: '#73BFBA',
              bold: true,
              alignment:'center',
              fontSize:6
          },
          header4: {
              color:"white",
              fillColor: '#73BFBA',
              bold: true,
              alignment:'right',
              fontSize:6
          },
          total:{
              color:"white",
              bold: true,
              fontSize:6,
              fillColor:'#73BFBA',
              alignment:'center'
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          }
        }
      }
      bulletins.forEach((bulletin) => {
        const gl = cal2.getTotal(bulletin);
        grandeLigne.push({ref: `${bulletin.employe['matricule_de_solde']} ${bulletin.employe['prenom']} ${bulletin.employe['nom']}`,
        brut: gl.totalIm,
        retenues: gl.totalRet,
        avantages: gl.totalNI,
        nap:gl.nap
      });

      const olds = [];
      prevR.forEach(r => {
        olds.push(r?.bulletins?.filter(bu => bu.employe['_id'].toString() === bulletin.employe['_id'].toString()) ?? []);
      })
       

        const {debut,fin} = bulletin.lot as Lot;
        const debutStr = format(parse(debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr});
          const finStr = format(parse(fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr});
          const anneeStr = format(parse(debut,'yyyy-MM-dd',new Date()),'MMMM',{locale:fr}).toUpperCase();
        const employe = bulletin.employe as Employe;
        const cal = new Calcul();
        const totauxAnnuels = cal.getTotauxAnnuel([...flatten(olds),bulletin]);
       docDefinition.content.push(
        [
          {
            columns: [
              {
              with: '20%',
              alignment:'left',
              stack: [
                {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
                {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
                {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
                {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
                {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
                {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
                {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
              ]},
              { qr: `${idReg}:${bulletin.employe['_id'].toString()}`,fit:80,alignment:'center',eccLevel:'M' },
              {
                with:'20%',
                alignment:'right',
                stack:[
                  {image:'src/lot/helpers/logo.png',width: 80,margin:[10,2]},
                  {text: `Du ${debutStr} Au ${finStr}`,fontSize: 6,bold: true}
                ]
                
              }
            ]
          },
          {
            margin: [50,5],
            fillColor:"#73BFBA",
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: [400],
              body: [
                [ {text:"BULLETIN DE PAIE",fontSize: 16,bold: true,color:'white',margin:[0,2]}],
              ]
            }
          },
          {
            columns:[
             {
              with: 'auto',
              alignment:'left',
              fontSize:6,
              italics:true,
             text:`Convention Collective. CONVENTION ETS PUBLICS\n`
             },
             {
              with: 'auto',
              alignment:'right',
              fontSize:6,
              italics:true,
              text:`BULLETINS DU MOIS DE ${anneeStr}\n`
              }
            ]
          },
          {
              columns:[
               {
                  alignment:'left',
                  margin: [10,0],
                  layout:'noBorders',
                  table: {
              body: [
                [{text:'Prenom et Nom :',style:'info'}, {text:`${employe.prenom} ${employe.nom}`,fontSize: 6}],
                [{text:'Matricule de Solde :',style:'info'}, {text:`${employe.matricule_de_solde}`,fontSize: 6}],
                          [{text:'Emploi :',style:'info'}, {text:`${employe.poste}`,fontSize:6}],
                          [{text:'Nombre de parts :',style:'info'}, {text:`${employe.nombre_de_parts}`,fontSize: 6}],
                          [{text:'Contrat :',style:'info'}, {text:`${employe.type}`,fontSize:6}],
              ]
            }
               },
               {
                  alignment:'left',
                  margin: [10,0],
                  layout:'noBorders',
                  table: {
              body: [
                [{text:'Catégorie :',style:'info'}, {text:`${employe.categorie.code}`,fontSize:6}],
                [{text:'Coefficient Horaire :',style:'info'}, {text:'173,33',fontSize:6}],
                          [{text:'Ancienneté :',style:'info'}, {text:cal.getAnciennete(employe.date_de_recrutement),fontSize:6}],
                          [{text:'Date de Recrutement :',style:'info'}, {text:format(parse(employe.date_de_recrutement,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr}),fontSize:6}]
              ]
            }
                }
              ]
            },
            {
              margin: [5,5,0,5],
              alignment:'center',
              fillColor:'white',
              table: {
                  widths: ['*',150, '*', '*', '*',5,50,'*'],
                        body: [
                            [ {text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},''],
                        ]
                    }
            },
          {
          margin: [5,0,0,5],
            layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
            },
            table: {
              widths: ['*',150, '*', '*', '*',5,50,'*'],
              headerRows: 1,
            body: [
              [{text:'#',style:'header'},{text:'Rubriques',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
              ...cal.imposable(bulletin.lignes['gains']).sort((l,r) => l.rubrique.code - r.rubrique.code).map((a,i) => {
                if(i === 0){
                  return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base /100)) : '',style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
              }),
              [{text:'Total Brut',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(cal.totalImposable),style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:formatNumber(cal.tppi) || '',style:'total',colSpan:2},''],
            ]
          }
          },
          {
              margin: [5,0,0,5],
              layout: {
                  fillColor:(i,node) => {
                      return i % 2 === 0 ? '#f5f5dc' : 'white';
                  }
              },
              table: {
                  widths: ['*',150, '*', '*', '*',5,50,'*'],
                  headerRows: 1,
                body: [
                  ...cal.retenues(bulletin.lignes['retenues']).sort((l,r) => l.rubrique.code - r.rubrique.code).map((a,i) => {
                    if(i === 0){
                      return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
                  }
                   return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
                  }),
                  [{text:'Total Retenues',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(cal.totalRetenue),style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:formatNumber(cal.tppr) || '',style:'total',colSpan:2},'']
                ]
              }
          },
          {
              margin: [5,0,0,5],
              layout: {
                  fillColor:(i,node) => {
                      return i % 2 === 0 ? '#f5f5dc' : 'white';
                  }
              },
              table: {
                  widths: ['*',150, '*', '*', '*',5,50,'*'],
                  headerRows: 1,
                body: [
                  ...cal.nonimposable(bulletin.lignes['gains']).sort((l,r) => l.rubrique.code - r.rubrique.code).map((a,i) => {
                    if(i === 0){
                      return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
                  }
                   return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? formatNumber(Math.round(a.taux2 * a.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
                  }),
                  [{text:'Total Non Imposable',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(cal.totalNomImposable),style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:formatNumber(cal.tppni) || '',style:'total',colSpan:2},'']
                ]
              }
          },
          {
              margin: [5,0,0,5],
              pageBreak:'after',
              table: {
                  widths: ['*', '*', '*', '*','*',80],
                  headerRows: 1,
                body: [
                  [{text:'Totaux',style:'header3'}, {text: 'Brut',style:'header3'}, {text:'Charges Salariale',style:'header3'},{text:'Charges Patronales',style: 'header3'},{text:'Avantages',style:'header3'},{text:'Net A Payer',style:'header3'}],
                  [{text:'Totaux Mensuels',style:'header2'}, {text: formatNumber(cal.totalImposable),style:'nombre'}, {text:formatNumber(cal.totalRetenue),style:'nombre'},{text: formatNumber(cal.totalPp),style: 'nombre'},{text:formatNumber(cal.totalNomImposable),style: 'nombre'},{text:formatNumber(cal.totalImposable + cal.totalNomImposable - cal.totalRetenue),style: 'nombre'}],
                  [{text:'Totaux Annuels',style:'header2'}, {text: formatNumber(totauxAnnuels.totalIm),style:'nombre'}, {text:formatNumber(totauxAnnuels.totalRet),style:'nombre'},{text:formatNumber(totauxAnnuels.totalPP),style: 'nombre'},{text:formatNumber(totauxAnnuels.totalNI),style: 'nombre'},{text:formatNumber(totauxAnnuels.nap),style: 'nombre'}],
                ]
              }
          }
          
        ]
       );

      });
      totalGrandeLigne = grandeLigne.reduce((acc,cur) => {
        acc.retenues += cur.retenues;
        acc.avantages += cur.avantages;
        acc.brut += cur.brut;
        acc.nap += cur.nap;
        return acc;
      },{brut:0,retenues:0,avantages:0,nap:0})
      docDefinition.content.push([
        {
          columns: [
            {
            with: '20%',
            alignment:'left',
            stack: [
              {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
              {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
            ]},
            {
              with:'20%',
              alignment:'right',
              stack:[
                {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 6,bold: true}
              ]
              
            }
          ]
        },
        {
          margin: [30,5],
          fillColor:"#73BFBA",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: [400],
            body: [
              [ {text:"TABLEAU DES GRANDES LIGNES",fontSize: 16,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
        {
            margin: [2,0,0,2],
            layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
          },
            pageBreak:'after',
            table: {
                widths: [15,150, '*', '*', '*','*'],
                headerRows: 1,
              body: [
                [{text:'N°',style:'header3'},{text:'Employé(e)',style:'header3'}, {text: 'Brut',style:'header3'}, {text:'Retenues',style:'header3'},{text:'Avantages',style: 'header3'},{text:'Net',style:'header3'}],
                ...grandeLigne.map((g,i) => ([{text:(i+1),style:'header2'},{text:g.ref,style:'header2'}, {text: formatNumber(g.brut),style:'nombre'}, {text:formatNumber(g.retenues),style:'nombre'},{text: formatNumber(g.avantages),style: 'nombre'},{text:formatNumber(g.nap),style: 'nombre'}])),
                [{text:'Totaux',bold: true,colSpan:2},'', {text: formatNumber(totalGrandeLigne.brut),bold: true,style:'nombre'}, {text:formatNumber(totalGrandeLigne.retenues),bold:true,style:'nombre'},{text: formatNumber(totalGrandeLigne.avantages),bold: true,style: 'nombre'},{text:formatNumber(totalGrandeLigne.nap),bold: true,style: 'nombre'}]
              ]
            }
        }
        
      ]);
      let IRCC = [];
      let IRG = [];
      let CSS = [];
      let IMPSR = [];
      let FNR = [];
      bulletins.forEach(b => {
          let l = {employe:null,ligne:null};
          let l2 = {employe:null,ligne:null};
          let l3 = {employe:null,at:null,af:null};
          let l4 = {employe:null,imp:null,trf:null};
          let l5 = {employe:null,ligne:null};
          l.employe = b.employe;
          l2.employe = b.employe;
          l3.employe = b.employe;
          l4.employe = b.employe;
          l5.employe = b.employe;
          l.ligne = b.lignes['retenues'].find(r => r.rubrique.code === 1010);
          if(l.ligne){
            IRCC.push(l);
          }
          l2.ligne = b.lignes['retenues'].find(r => r.rubrique.code === 1000);
          if(l2.ligne){
            IRG.push(l2);
          }

          l3.at = b.lignes['retenues'].find(r => r.rubrique.code === 1040) ?? {montant:0,base: 0,taux2:1,taux1:1};

          l3.af = b.lignes['retenues'].find(r => r.rubrique.code === 1050) ?? {montant:0,base: 0,taux2:1,taux1:1};
          if(l3.at || l3.af){
            CSS.push(l3);
          }

          l4.imp = b.lignes['retenues'].find(r => r.rubrique.code === 1080) ?? {montant:0,base: 0,taux2:1,taux1:1};
          l4.trf = b.lignes['retenues'].find(r => r.rubrique.code === 1999) ?? {montant:0,base: 0,taux2:1,taux1:1};
          if(l4.imp || l4.imp){
            IMPSR.push(l4);
          }

          l5.ligne = b.lignes['retenues'].find(r => r.rubrique.code === 1013);
          if(l5.ligne){
            FNR.push(l5);
          }
      });
      const {t1,t2} = IRCC.reduce((acc,cur) => {
        acc.t1 += cur.ligne.montant;
        acc.t2 += Math.round(cur.ligne.taux2 * cur.ligne.base / 100);
        return acc;
      },{t1:0,t2:0});
      const {t3,t4} = IRG.reduce((acc,cur) => {
        acc.t3 += cur.ligne.montant;
        acc.t4 += Math.round(cur.ligne.taux2 * cur.ligne.base / 100);
        return acc;
      },{t3:0,t4:0});
      const {t5,t6} = CSS.reduce((acc,cur) => {
        acc.t5 += cur.at.base / 100;
        acc.t6 += Math.round(cur.af.taux2 * cur.af.base / 100);
        return acc;
      },{t5:0,t6:0});

      const {t7,t8,ti} = IMPSR.reduce((acc,cur) => {
        acc.ti += (cur?.imp?.montant ?? 0) + (cur?.trf?.montant ?? 0);
        acc.t7 += cur?.imp?.montant ?? 0;
        acc.t8 += cur?.trf?.montant ?? 0;
        return acc;
      },{t7:0,t8:0,ti:0});
      const {t9,t10} = FNR.reduce((acc,cur) => {
        acc.t9 += cur.ligne.montant;
        acc.t10 += Math.round(cur.ligne.taux2 * cur.ligne.base / 100);
        return acc;
      },{t9:0,t10:0});
      docDefinition.content.push([
        {
          columns: [
            {
            with: '20%',
            alignment:'left',
            stack: [
              {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
              {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
            ]},
            {
              with:'20%',
              alignment:'right',
              stack:[
                {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 6,bold: true}
              ]
              
            }
          ]
        },
        {
          margin: [30,15],
          fillColor:"#73BFBA",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: [400],
            body: [
              [ {text:"IPRES REGIME COMPLEMENTAIRE CADRE",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
      
        {
          margin: [10,5,0,0],
          alignment:'center',
          fillColor:'white',
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
                    body: [
                        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 6,bold: true,colSpan:3,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},''],
                    ]
                }
        },
        {
          margin: [10,0,0,10],
          layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
          },
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
              headerRows: 1,
            body: [
              [{text:'N°',style:'header'},{text:'Employes',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
              ...IRCC.map((a,i) => {
                if(i === 0){
                  return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.ligne.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.ligne.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.ligne.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.ligne.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.ligne.taux2 ? formatNumber(Math.round(a.ligne.taux2 * a.ligne.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.ligne.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.ligne.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.ligne.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.ligne.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.ligne.taux2 ? formatNumber(Math.round(a.ligne.taux2 * a.ligne.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
              }),
              [{text:'Total',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(t1),style:'total'},{text:'',border:[true,false,true,false]},{text:formatNumber(t2) || '',style:'total',colSpan:2},'']
            ]
          }
      },
      {
        margin: [30,5],
        fillColor:"black",
        alignment:'center',
        layout:'noBorders',
        pageBreak:'after',
        table: {
          widths: [400],
          body: [
            [ {text:`TOTAL IPRES REGIME COMPLEMENTAIRE CADRE: ${formatNumber(t1 + t2)} FCFA`,fontSize: 6,bold: true,color:'white',margin:[0,2]}],
          ]
        }
      },
      ]);
      docDefinition.content.push([
        {
          columns: [
            {
            with: '20%',
            alignment:'left',
            stack: [
              {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
              {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
            ]},
            {
              with:'20%',
              alignment:'right',
              stack:[
                {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 6,bold: true}
              ]
              
            }
          ]
        },
        {
          margin: [50,10],
          fillColor:"#73BFBA",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: [400],
            body: [
              [ {text:"IPRES REGIME GENERAL",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
      
        {
          margin: [10,5,0,0],
          alignment:'center',
          fillColor:'white',
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
                    body: [
                        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},''],
                    ]
                }
        },
        {
          margin: [10,0,0,10],
          layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
          },
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
              headerRows: 1,
            body: [
              [{text:'N°',style:'header'},{text:'Employes',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
              ...IRG.map((a,i) => {
                if(i === 0){
                  return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.ligne.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.ligne.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.ligne.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.ligne.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.ligne.taux2 ? formatNumber(Math.round(a.ligne.taux2 * a.ligne.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.ligne.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.ligne.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.ligne.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.ligne.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.ligne.taux2 ? formatNumber(Math.round(a.ligne.taux2 * a.ligne.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
              }),
              [{text:'Total',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(t3),style:'total'},{text:'',border:[true,false,true,false]},{text:formatNumber(t4) || '',style:'total',colSpan:2},'']
            ]
          }
      },
      {
        margin: [30,5],
        fillColor:"black",
        alignment:'center',
        layout:'noBorders',
        pageBreak:'after',
        table: {
          widths: [400],
          body: [
            [ {text:`TOTAL IPRES REGIME GENERAL: ${formatNumber(t3 + t4)} FCFA`,fontSize: 6,bold: true,color:'white',margin:[0,2]}],
          ]
        }
      },
      ]);
      docDefinition.content.push([
        {
          columns: [
            {
            with: '20%',
            alignment:'left',
            stack: [
              {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
              {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
            ]},
            {
              with:'20%',
              alignment:'right',
              stack:[
                {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 6,bold: true}
              ]
              
            }
          ]
        },
        {
          margin: [30,15],
          fillColor:"#73BFBA",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: [400],
            body: [
              [ {text:"CAISSE DE SECURITE SOCIALE",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
      
        {
          margin: [10,5,0,0],
          alignment:'center',
          fillColor:'white',
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
                    body: [
                        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"Accident du Travail",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"Allocations Familliales",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},''],
                    ]
                }
        },
        {
          margin: [10,0,0,10],
          layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
          },
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
              headerRows: 1,
            body: [
              [{text:'N°',style:'header'},{text:'Employes',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
              ...CSS.map((a,i) => {
                if(i === 0){
                  return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.at.base) || '',style: 'nombre',border:[false,true,true,false]},{text:'1',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.at.base / 100),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.af.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.af.taux2 ? formatNumber(Math.round(a.af.taux2 * a.af.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.at.base) || '',style: 'nombre',border:[false,false,true,false]},{text:'1',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.at.base / 100),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.af.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.af.taux2 ? formatNumber(Math.round(a.af.taux2 * a.af.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
              }),
              [{text:'Total',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(t5),style:'total'},{text:'',border:[true,false,true,false]},{text:formatNumber(t6) || '',style:'total',colSpan:2},'']
            ]
          }
      },
      {
        margin: [30,5],
        fillColor:"black",
        alignment:'center',
        layout:'noBorders',
        pageBreak:'after',
        table: {
          widths: [400],
          body: [
            [ {text:`TOTAL CAISSE DE SECURITE SOCIALE: ${formatNumber(t5 + t6)} FCFA`,fontSize: 6,bold: true,color:'white',margin:[0,2]}],
          ]
        }
      },
      ]);

      docDefinition.content.push([
        {
          columns: [
            {
            with: '20%',
            alignment:'left',
            stack: [
              {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
              {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
            ]},
            {
              with:'20%',
              alignment:'right',
              stack:[
                {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 6,bold: true}
              ]
              
            }
          ]
        },
        {
          margin: [30,15],
          fillColor:"#73BFBA",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: [400],
            body: [
              [ {text:"IMPOT SUR LE REVENU",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
      
        {
          margin: [10,5,0,0],
          alignment:'center',
          fillColor:'white',
          table: {
              widths: [15,150,'*', '*', '*','*'],
                    body: [
                        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"ELEMENTS",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:"MONTANT",fontSize: 6,bold: true,border:[true,true,true,true]}],
                    ]
                }
        },
        {
          margin: [10,0,0,10],
          layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
          },
          table: {
              widths: [15,150,'*', '*', '*','*'],
              headerRows: 1,
            body: [
              [{text:'N°',style:'header'},{text:'Employes',style:'header'}, {text: 'Base',style:'header'}, {text:'Impot',style:'header'},{text:'Trimf',style: 'header'},{text:'Total',style: 'header'}],
              ...IMPSR.map((a,i) => {
                if(i === 0){
                  return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.imp.base) || '',style: 'nombre',border:[false,true,true,false]},{text:formatNumber(a?.imp?.montant) || '-',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.trf.montant),style: 'nombre',border:[false,true,true,false]},{text:formatNumber((a?.imp?.montant ?? 0) + a.trf.montant),style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.imp.base) || '',style: 'nombre',border:[false,false,true,false]},{text:formatNumber(a?.imp?.montant) || '-',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.trf.montant),style: 'nombre',border:[false,false,true,false]},{text:formatNumber((a?.imp?.montant ?? 0) + a.trf.montant),style:'nombre',border:[false,false,true,false]}]
              }),
            [{text:'Total',bold: true,fillColor:'white',fontSize:6,colSpan:3},'','',{text:formatNumber(t7),style:'total'},{text:formatNumber(t8) || '',style:'total'},{text:formatNumber(ti) || '',style:'total'}]
            ]
          }
      },
      {
        margin: [30,5],
        fillColor:"black",
        alignment:'center',
        layout:'noBorders',
        pageBreak:'after',
        table: {
          widths: [400],
          body: [
            [ {text:`TOTAL IMPOT SUR LE REVENU: ${formatNumber(t7 + t8)} FCFA`,fontSize: 6,bold: true,color:'white',margin:[0,2]}],
          ]
        }
      },
      ]);
      docDefinition.content.push([
        {
          columns: [
            {
            with: '20%',
            alignment:'left',
            stack: [
              {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"Un Peuple, Un but, Une Foi\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {image:'src/lot/helpers/drapeau.jpg',width: 40,alignment:"center"},
              {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 6,bold: true,alignment:"center"},
              {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 6,bold: true,margin:[0,2],alignment:"center"},
              {text:"SOCIALES DE ZIGUINCHOR",fontSize: 6,bold: true,alignment:"center"}
            ]},
            {
              with:'20%',
              alignment:'right',
              stack:[
                {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                {text: `Du ${format(parse(lot.debut,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})} Au ${format(parse(lot.fin,'yyyy-MM-dd',new Date()),'dd MMMM yyyy',{locale:fr})}`,fontSize: 6,bold: true}
              ]
              
            }
          ]
        },
        {
          margin: [30,15],
          fillColor:"#73BFBA",
          alignment:'center',
          layout:'noBorders',
          table: {
            widths: [400],
            body: [
              [ {text:"FOND NATIONAL DE RETRAITE",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
            ]
          }
        },
      
        {
          margin: [10,5,0,0],
          alignment:'center',
          fillColor:'white',
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
                    body: [
                        [{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 6,bold: true,colSpan:2,border:[true,true,true,false]},''],
                    ]
                }
        },
        {
          margin: [10,0,0,10],
          layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#f5f5dc' : 'white';
              }
          },
          table: {
              widths: [15,150,'*', '*', '*',5,'*','*'],
              headerRows: 1,
            body: [
              [{text:'N°',style:'header'},{text:'Employes',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
              ...FNR.map((a,i) => {
                if(i === 0){
                  return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,true,true,false]},{text:formatNumber(a.ligne.base) || '',style: 'nombre',border:[false,true,true,false]},{text:a.ligne.taux1 || '',style:'header2',border:[false,true,true,false]},{text:formatNumber(a.ligne.montant),style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.ligne.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.ligne.taux2 ? formatNumber(Math.round(a.ligne.taux2 * a.ligne.base / 100)) : '',style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:(i+1),style:'header2'},{text:`${a.employe.matricule_de_solde}|${a.employe.prenom} ${a.employe.nom}`,style: 'header2',border:[true,false,true,false]},{text:formatNumber(a.ligne.base) || '',style: 'nombre',border:[false,false,true,false]},{text:a.ligne.taux1 || '',style:'header2',border:[false,false,true,false]},{text:formatNumber(a.ligne.montant),style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.ligne.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.ligne.taux2 ? formatNumber(Math.round(a.ligne.taux2 * a.ligne.base / 100)) : '',style:'nombre',border:[false,false,true,false]}]
              }),
              [{text:'Total',colSpan:4,bold: true,fillColor:'white',fontSize:6},'','','',{text:formatNumber(t9),style:'total'},{text:'',border:[true,false,true,false]},{text:formatNumber(t10) || '',style:'total',colSpan:2},'']
            ]
          }
      },
      {
        margin: [30,5],
        fillColor:"black",
        alignment:'center',
        layout:'noBorders',
        pageBreak:'after',
        table: {
          widths: [400],
          body: [
            [ {text:`TOTAL FONDS NATIONAL RETRAITE: ${formatNumber(t9 + t10)} FCFA`,fontSize: 6,bold: true,color:'white',margin:[0,2]}],
          ]
        }
      },
      ]);
      const options = {};
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition, options);
      pdfDoc.pipe(createWriteStream(`uploads/bulletins/${_id.toString()}-${mois}-${annee}.pdf`));
      pdfDoc.end();
    }
}