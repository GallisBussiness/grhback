import { createWriteStream } from "fs";
import PdfPrinter from 'pdfmake';
import { Bulletin } from "src/bulletin/entities/bulletin.entity";
import { Lot } from "../entities/lot.entity";
import { Employe } from "src/employe/entities/employe.entity";
import { Calcul } from "./calcul";
import { Registre } from "src/registre/entities/registre.entity";

const fonts = {
    Roboto: {
      normal: 'src/lot/helpers/font/roboto-font/Roboto-Regular.ttf',
      bold: 'src/lot/helpers/font/roboto-font/Roboto-Medium.ttf',
      italics: 'src/lot/helpers/font/roboto-font/Roboto-Italic.ttf',
      bolditalics: 'src/lot/helpers/roboto-font/font/Roboto-MediumItalic.ttf'
    }
  };

export class PdfMaker {
    private printer = new PdfPrinter(fonts);


  make(bulletin: Bulletin,olds:Bulletin[]){
            
           const {mois,annee,debut,fin} = bulletin.lot as Lot;
          const employe = bulletin.employe as Employe;
          const cal = new Calcul();
          
          const totauxAnnuels = cal.getTotauxAnnuel(olds);
          const  docDefinition = {
            footer: function() { return {text:'DANS VOTRE INTERET ET POUR VOUS AIDER A FAIRE VALOIR VOS DROITS, CONSERVER CE BULLETIN DE PAIE SANS LIMITATION DE DUREE',fontSize:8,alignment:'center'}},
            watermark: { text: `Bulletin CROUS/Z ${annee}`, color: 'grey', opacity: 0.3, bold: true, italics: false },
          content: [
            {
              columns: [
                {
                with: '20%',
                alignment:'left',
                stack: [
                  {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 8,bold: true,margin:[0,2]},
                  {text:"Un Peuple, Un but, Une Foi\n",fontSize: 8,bold: true},
                  {image:'src/lot/helpers/drapeau.jpg',width: 40,margin:[30,2]},
                  {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 8,bold: true},
                  {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 8,bold: true,margin:[0,2]},
                  {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 8,bold: true},
                  {text:"SOCIALES DE ZIGUINCHOR",fontSize: 8,bold: true}
                ]},
                {
                  with:'20%',
                  alignment:'right',
                  stack:[
                    {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                    {text: `Période : du ${debut} au ${fin}`,fontSize: 8,bold: true}
                  ]
                  
                }
              ]
            },
            {
              margin: [50,15],
              fillColor:"#4ad2f7",
              alignment:'center',
              layout:'noBorders',
              table: {
                widths: [400],
                body: [
                  [ {text:"BULLETIN DE PAIE",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
                ]
              }
            },
            {
              columns:[
               {
                with: 'auto',
                alignment:'left',
                fontSize:8,
                italics:true,
               text:`Convention Collective. CONVENTION ETS PUBLICS | --REF-- BLT N°3\n`
               },
               {
                with: 'auto',
                alignment:'right',
                fontSize:8,
                italics:true,
                text:`BULLETINS DU MOIS DE NOVEMBRE\n`
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
                  [{text:'Prenom et Nom :',style:'info'}, {text:`${employe.prenom} ${employe.nom}`,fontSize: 8}],
                  [{text:'Matricule de Solde :',style:'info'}, {text:`${employe.matricule_de_solde}`,fontSize: 8}],
                            [{text:'Emploi :',style:'info'}, {text:'Permanant',fontSize:8}],
                            [{text:'Nombre de parts :',style:'info'}, {text:`${employe.nombre_de_parts}`,fontSize: 8}]
                ]
              }
                 },
                 {
                    alignment:'right',
                    margin: [10,0],
                    layout:'noBorders',
                    table: {
                body: [
                  [{text:'Catégorie :',style:'info'}, {text:`${employe.categorie.code}`,fontSize:8}],
                  [{text:'Coefficient Horaire :',style:'info'}, {text:'173,33',fontSize:8}],
                            [{text:'Ancienneté :',style:'info'}, {text:cal.getAnciennete(employe.date_de_recrutement),fontSize:8}],
                            [{text:'Date de Recrutement :',style:'info'}, {text:employe.date_de_recrutement,fontSize:8}]
                ]
              }
                  }
                ]
              },
              {
                margin: [10,5,0,0],
                alignment:'center',
                fillColor:'white',
                table: {
                    widths: ['*',160, '*', '*', '*',5,50,'*'],
                          body: [
                              [{text:'',border:[false,false,false,false]}, {text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 8,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 8,bold: true,colSpan:2,border:[true,true,true,false]},''],
                          ]
                      }
              },
            {
            margin: [10,0,0,10],
              layout: {
                fillColor:(i,node) => {
                    return i % 2 === 0 ? '#9bfab4' : 'white';
                }
              },
              table: {
                widths: ['*',160, '*', '*', '*',5,50,'*'],
                headerRows: 1,
              body: [
                [{text:'#',style:'header'},{text:'Rubriques',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
                ...cal.imposable(bulletin.lignes['gains']).map((a,i) => {
                    if(i === 0){
                        return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:a.base || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:a.montant,style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,true,true,false]}]
                    }
                     return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:a.base || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:a.montant,style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,false,true,false]}]
                }),
                [{text:'Total Brut',colSpan:4,bold: true,fillColor:'white',fontSize:8},'','','',{text:cal.totalImposable,style:'total'},{text:'',border:[true,false,true,false]},{text:cal.tppi || '',style:'total',colSpan:2},''],
              ]
            }
            },
            {
                margin: [10,0,0,10],
                layout: {
                    fillColor:(i,node) => {
                        return i % 2 === 0 ? '#9bfab4' : 'white';
                    }
                },
                table: {
                    widths: ['*',160, '*', '*', '*',5,50,'*'],
                    headerRows: 1,
                  body: [
                    ...cal.retenues(bulletin.lignes['retenues']).map((a,i) => {
                      if(i === 0){
                        return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:a.base || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:a.montant,style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,true,true,false]}]
                    }
                     return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:a.base || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:a.montant,style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,false,true,false]}]
                    }),
                    [{text:'Total Retenues',colSpan:4,bold: true,fillColor:'white',fontSize:8},'','','',{text:cal.totalRetenue,style:'total'},{text:'',border:[true,false,true,false]},{text:cal.tppr || '',style:'total',colSpan:2},'']
                  ]
                }
            },
            {
                margin: [10,0,0,10],
                layout: {
                    fillColor:(i,node) => {
                        return i % 2 === 0 ? '#9bfab4' : 'white';
                    }
                },
                table: {
                    widths: ['*',160, '*', '*', '*',5,50,'*'],
                    headerRows: 1,
                  body: [
                    ...cal.nonimposable(bulletin.lignes['gains']).map((a,i) => {
                      if(i === 0){
                        return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:a.base || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:a.montant,style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,true,true,false]}]
                    }
                     return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:a.base || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:a.montant,style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,false,true,false]}]
                    }),
                    [{text:'Total Non Imposable',colSpan:4,bold: true,fillColor:'white',fontSize:8},'','','',{text:cal.totalNomImposable,style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:cal.tppni || '',style:'total',colSpan:2},'']
                  ]
                }
            },
            {
                margin: [10,0,0,10],
                table: {
                    widths: ['*', '*', 100, 100,'*',80],
                    headerRows: 1,
                  body: [
                    [{text:'Totaux',style:'header3'}, {text: 'Brut',style:'header3'}, {text:'Charges Salariale',style:'header3'},{text:'Charges Patronales',style: 'header3'},{text:'Avantages',style:'header3'},{text:'Net A Payer',style:'header3'}],
                    [{text:'Totaux Mensuels',style:'header2'}, {text: cal.totalImposable,style:'header2'}, {text:cal.totalRetenue,style:'header2'},{text: cal.totalPp,style: 'header2'},{text:cal.totalNomImposable,style: 'header2'},{text:(cal.totalImposable + cal.totalNomImposable - cal.totalRetenue),style: 'header3'}],
                    [{text:'Totaux Annuels',style:'header2'}, {text: totauxAnnuels.totalIm,style:'header2'}, {text:totauxAnnuels.totalRet,style:'header2'},{text:totauxAnnuels.totalPP,style: 'header2'},{text:totauxAnnuels.totalNI,style: 'header2'},{text:totauxAnnuels.nap,style: 'header2'}],
        
                  ]
                }
            }
            
          ],
          styles: {
            header: {
                color:"white",
                border: [true, true, true, true],
                fillColor: '#4ad2f7',
                bold: true,
                alignment:'center',
                fontSize:8
            },
            header2: {
                alignment:'center',
                fontSize:6,
                bold: true
            },
            nombre: {
              alignment:'right',
              fontSize:6,
              bold: true
          },
             info: {
              fontSize:8,
              bold: true
          },
            header3: {
                color:"white",
                fillColor: '#4ad2f7',
                bold: true,
                alignment:'center',
                fontSize:8
            },
            total:{
                color:"white",
                bold: true,
                fontSize:10,
                fillColor:'#4ad2f7',
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
          pdfDoc.pipe(createWriteStream(`uploads/bulletins/${employe._id}-${mois}-${annee}.pdf`));
          pdfDoc.end();
    }

    makeAll(bulletins: Bulletin[],lot: Lot,prevR:Registre[]){

      const {mois,annee} = lot;
      const docDefinition = {
        footer: function(currentPage, pageCount) { return {text:'DANS VOTRE INTERET ET POUR VOUS AIDER A FAIRE VALOIR VOS DROITS, CONSERVER CE BULLETIN DE PAIE SANS LIMITATION DE DUREE',fontSize:8,alignment:'center'}},
        watermark: { text: `Bulletin CROUS/Z ${annee}`, color: 'grey', opacity: 0.3, bold: true, italics: false },
        content:[],
        styles: {
          header: {
              color:"white",
              border: [true, true, true, true],
              fillColor: '#4ad2f7',
              bold: true,
              alignment:'center',
              fontSize:8
          },
          header2: {
              alignment:'center',
              fontSize:6,
              bold: true
          },
          nombre: {
            alignment:'right',
            fontSize:6,
            bold: true
        },
           info: {
            fontSize:8,
            bold: true
        },
          header3: {
              color:"white",
              fillColor: '#4ad2f7',
              bold: true,
              alignment:'center',
              fontSize:8
          },
          total:{
              color:"white",
              bold: true,
              fontSize:10,
              fillColor:'#4ad2f7',
              alignment:'center'
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          }
        }
      }
      bulletins.forEach((bulletin) => {
        const olds = prevR.map(r => r.bulletins.find(bu => bu.employe['_id'].toString() === bulletin.employe['_id'].toString()));

        const {debut,fin} = bulletin.lot as Lot;
        const employe = bulletin.employe as Employe;
        const cal = new Calcul();
        const totauxAnnuels = cal.getTotauxAnnuel(olds);
       docDefinition.content.push(
        [
          {
            columns: [
              {
              with: '20%',
              alignment:'left',
              stack: [
                {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 8,bold: true,margin:[0,2]},
                {text:"Un Peuple, Un but, Une Foi\n",fontSize: 8,bold: true},
                {image:'src/lot/helpers/drapeau.jpg',width: 40,margin:[30,2]},
                {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR\n",fontSize: 8,bold: true},
                {text:"DE LA RECHERCHE ET DE L'INNOVATION\n",fontSize: 8,bold: true,margin:[0,2]},
                {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES",fontSize: 8,bold: true},
                {text:"SOCIALES DE ZIGUINCHOR",fontSize: 8,bold: true}
              ]},
              {
                with:'20%',
                alignment:'right',
                stack:[
                  {image:'src/lot/helpers/logo.png',width: 100,margin:[10,2]},
                  {text: `Période : du ${debut} au ${fin}`,fontSize: 8,bold: true}
                ]
                
              }
            ]
          },
          {
            margin: [50,15],
            fillColor:"#4ad2f7",
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: [400],
              body: [
                [ {text:"BULLETIN DE PAIE",fontSize: 18,bold: true,color:'white',margin:[0,4]}],
              ]
            }
          },
          {
            columns:[
             {
              with: 'auto',
              alignment:'left',
              fontSize:8,
              italics:true,
             text:`Convention Collective. CONVENTION ETS PUBLICS | --REF-- BLT N°3\n`
             },
             {
              with: 'auto',
              alignment:'right',
              fontSize:8,
              italics:true,
              text:`BULLETINS DU MOIS DE NOVEMBRE\n`
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
                [{text:'Prenom et Nom :',style:'info'}, {text:`${employe.prenom} ${employe.nom}`,fontSize: 8}],
                [{text:'Matricule de Solde :',style:'info'}, {text:`${employe.matricule_de_solde}`,fontSize: 8}],
                          [{text:'Emploi :',style:'info'}, {text:'Permanant',fontSize:8}],
                          [{text:'Nombre de parts :',style:'info'}, {text:`${employe.nombre_de_parts}`,fontSize: 8}]
              ]
            }
               },
               {
                  alignment:'right',
                  margin: [10,0],
                  layout:'noBorders',
                  table: {
              body: [
                [{text:'Catégorie :',style:'info'}, {text:`${employe.categorie.code}`,fontSize:8}],
                [{text:'Coefficient Horaire :',style:'info'}, {text:'173,33',fontSize:8}],
                          [{text:'Ancienneté :',style:'info'}, {text:cal.getAnciennete(employe.date_de_recrutement),fontSize:8}],
                          [{text:'Date de Recrutement :',style:'info'}, {text:employe.date_de_recrutement,fontSize:8}]
              ]
            }
                }
              ]
            },
            {
              margin: [10,5,0,0],
              alignment:'center',
              fillColor:'white',
              table: {
                  widths: ['*',160, '*', '*', '*',5,50,'*'],
                        body: [
                            [ {text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:'',border:[false,false,false,false]},{text:"PART SALARIALE",fontSize: 8,bold: true,colSpan:2,border:[true,true,true,false]},'',{text:'',border:[true,false,true,false],fillColor:'white'},{text:"PART PATRONALE",fontSize: 8,bold: true,colSpan:2,border:[true,true,true,false]},''],
                        ]
                    }
            },
          {
          margin: [10,0,0,10],
            layout: {
              fillColor:(i,node) => {
                  return i % 2 === 0 ? '#9bfab4' : 'white';
              }
            },
            table: {
              widths: ['*',160, '*', '*', '*',5,50,'*'],
              headerRows: 1,
            body: [
              [{text:'#',style:'header'},{text:'Rubriques',style:'header'}, {text: 'Base',style:'header'}, {text:'Taux',style:'header'},{text:'Montant',style: 'header'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:'Taux',style:'header'},{text:'Montant',style: 'header'}],
              ...cal.imposable(bulletin.lignes['gains']).map((a,i) => {
                if(i === 0){
                  return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:a.base || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:a.montant,style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,true,true,false]}]
              }
               return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:a.base || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:a.montant,style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,false,true,false]}]
              }),
              [{text:'Total Brut',colSpan:4,bold: true,fillColor:'white',fontSize:8},'','','',{text:cal.totalImposable,style:'total'},{text:'',border:[true,false,true,false]},{text:cal.tppi || '',style:'total',colSpan:2},''],
            ]
          }
          },
          {
              margin: [10,0,0,10],
              layout: {
                  fillColor:(i,node) => {
                      return i % 2 === 0 ? '#9bfab4' : 'white';
                  }
              },
              table: {
                  widths: ['*',160, '*', '*', '*',5,50,'*'],
                  headerRows: 1,
                body: [
                  ...cal.retenues(bulletin.lignes['retenues']).map((a,i) => {
                    if(i === 0){
                      return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:a.base || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:a.montant,style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,true,true,false]}]
                  }
                   return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:a.base || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:a.montant,style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,false,true,false]}]
                  }),
                  [{text:'Total Retenues',colSpan:4,bold: true,fillColor:'white',fontSize:8},'','','',{text:cal.totalRetenue,style:'total'},{text:'',border:[true,false,true,false]},{text:cal.tppr || '',style:'total',colSpan:2},'']
                ]
              }
          },
          {
              margin: [10,0,0,10],
              layout: {
                  fillColor:(i,node) => {
                      return i % 2 === 0 ? '#9bfab4' : 'white';
                  }
              },
              table: {
                  widths: ['*',160, '*', '*', '*',5,50,'*'],
                  headerRows: 1,
                body: [
                  ...cal.nonimposable(bulletin.lignes['gains']).map((a,i) => {
                    if(i === 0){
                      return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,true,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,true,true,false]},{text:a.base || '',style: 'nombre',border:[false,true,true,false]},{text:a.taux1 || '',style:'header2',border:[false,true,true,false]},{text:a.montant,style: 'nombre',border:[false,true,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,true,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,true,true,false]}]
                  }
                   return [{text:`${a.rubrique.code}`,style: 'header2',border:[true,false,true,false]},{text:`${a.rubrique.libelle}`,style: 'header2',border:[true,false,true,false]},{text:a.base || '',style: 'nombre',border:[false,false,true,false]},{text:a.taux1 || '',style:'header2',border:[false,false,true,false]},{text:a.montant,style: 'nombre',border:[false,false,true,false]},{text:'',border:[true,false,true,false],fillColor:'white'},{text:a.taux2 || '',style: 'header2',border:[false,false,true,false]},{text:a.taux2 ? Math.round(a.taux2 * a.base) : '',style:'nombre',border:[false,false,true,false]}]
                  }),
                  [{text:'Total Non Imposable',colSpan:4,bold: true,fillColor:'white',fontSize:8},'','','',{text:cal.totalNomImposable,style:'total'},{text:'',border:[true,false,true,false],fillColor:'white'},{text:cal.tppni || '',style:'total',colSpan:2},'']
                ]
              }
          },
          {
              margin: [10,0,0,10],
              pageBreak:'after',
              table: {
                  widths: ['*', '*', 100, 100,'*',80],
                  headerRows: 1,
                body: [
                  [{text:'Totaux',style:'header3'}, {text: 'Brut',style:'header3'}, {text:'Charges Salariale',style:'header3'},{text:'Charges Patronales',style: 'header3'},{text:'Avantages',style:'header3'},{text:'Net A Payer',style:'header3'}],
                  [{text:'Totaux Mensuels',style:'header2'}, {text: cal.totalImposable,style:'header2'}, {text:cal.totalRetenue,style:'header2'},{text: cal.totalPp,style: 'header2'},{text:cal.totalNomImposable,style: 'header2'},{text:(cal.totalImposable + cal.totalNomImposable - cal.totalRetenue),style: 'header3'}],
                  [{text:'Totaux Annuels',style:'header2'}, {text: totauxAnnuels.totalIm,style:'header2'}, {text:totauxAnnuels.totalRet,style:'header2'},{text:totauxAnnuels.totalPP,style: 'header2'},{text:totauxAnnuels.totalNI,style: 'header2'},{text:totauxAnnuels.nap,style: 'header2'}],
                ]
              }
          }
          
        ]
       );

      })
      const options = {};
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition, options);
      pdfDoc.pipe(createWriteStream(`uploads/bulletins/${mois}-${annee}.pdf`));
      pdfDoc.end();
    }
}