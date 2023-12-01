import { intervalToDuration, parse } from "date-fns";

export class Calcul {
    public totalImposable = 0;
    public totalNomImposable = 0;
    public totalRetenue = 0;
    public totalPp = 0;
    public tppi = 0;
    public tppr = 0;
    public tppni = 0;

    imposable = (gains) => {
        const arr = gains.filter(g => g.rubrique.section.nom === 'IMPOSABLE');
        const total = arr.reduce((acc,cur) => acc + cur.montant,0);
        const totalpp = arr.reduce((acc,cur) => cur.taux2 ? acc + Math.round(cur.taux2 * cur.montant): acc + 0,0);
        this.totalImposable += total;
        this.totalPp += totalpp;
        this.tppi = totalpp;
        return arr;
    }
    
    nonimposable = (gains) => {
        const arr = gains.filter(g => g.rubrique.section.nom === 'NON-IMPOSABLE');
        const total = arr.reduce((acc,cur) => acc + cur.montant,0); 
        const totalpp = arr.reduce((acc,cur) => cur.taux2 ? acc + Math.round(cur.taux2 * cur.montant / 100): acc + 0,0);
        this.totalNomImposable += total;
        this.totalPp += totalpp;
        this.tppni = totalpp;
        return arr;
    }
    
    retenues = (retenues) => {
        const arr = retenues.filter(g => g.rubrique.section.nom === 'RETENUE');
        const total = arr.reduce((acc,cur) => acc + cur.montant,0);
        const totalpp = arr.reduce((acc,cur) => cur.taux2 ? acc + Math.round(cur.taux2 * cur.montant / 100): acc + 0,0);
        this.totalRetenue += total;
        this.totalPp += totalpp;
        this.tppr = totalpp;
        return arr;
    }
  
  
    getAnciennete(recrutement: string){
      const rd = parse(recrutement,"yyyy-MM-dd",new Date());
      const diff = intervalToDuration({start: rd,end: Date.now()})
      return `${diff.years} ans ${diff.months} mois ${diff.days} jours`;
    }
}