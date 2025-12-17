import { Injectable } from '@angular/core';
import { FichePaieInput, FichePaieResult, Avantage } from '../models/fp.model';

@Injectable({ providedIn: 'root' })
export class FpService {

  calculer(data: FichePaieInput): FichePaieResult {
    const joursOuvrables = data.joursOuvrablesParMois ?? 22;
    console.log('joursOuvrables', joursOuvrables);
    const salaireBase = data.salaireBase ?? 0;
    const prime = data.prime ?? 0;
    const heureSup = data.heureSup ?? 0;
    const salaireheureSup = data.salaireheureSup ?? 0;
    const indemnite = data.indemnite ?? 0;
    const congesPris = data.congesPris ?? 0;

    // Total autres avantages
    const totalAutresAvantages = (data.autresAvantages ?? []).reduce(
      (acc: number, v: Avantage) => acc + (v.montant ?? 0),
      0
    );

    // Calculs
    const brutHeuresSup = heureSup * salaireheureSup;
    const salaireConges = congesPris * (salaireBase / joursOuvrables);
    const brut = salaireBase + prime + brutHeuresSup + salaireConges + indemnite + totalAutresAvantages;

    const cnaps = brut * 0.01;
    const ostie = brut * 0.01;

    let irsa = this.calculIRSA(brut - cnaps - ostie);
    if (data.nbCharge) {
      irsa = Math.max(irsa - data.nbCharge * 2000, 0);
    }

    const net = brut - cnaps - ostie - irsa;

    return this.roundResult({
      nom: data.nom,
      poste: data.poste,
      brut,
      cnaps,
      ostie,
      irsa,
      net,
      congesPris,
      joursOuvrablesParMois: joursOuvrables,
      salaireBase,
      salaireheureSup,
      prime,
      heureSup,
      indemnite,
      autresAvantages: data.autresAvantages,
      nbCharge: data.nbCharge
    });
  }

  private calculIRSA(base: number): number {
    const tranches = [
      { plafond: 350_000, taux: 0 },
      { plafond: 400_000, taux: 0.05 },
      { plafond: 500_000, taux: 0.10 },
      { plafond: 600_000, taux: 0.15 },
      { plafond: Infinity, taux: 0.20 }
    ];

    let irsa = 0;
    let precedent = 0;

    for (const tranche of tranches) {
      if (base > precedent) {
        const montant = Math.min(base, tranche.plafond) - precedent;
        irsa += montant * tranche.taux;
        precedent = tranche.plafond;
      }
    }

    return irsa;
  }

  private roundResult(result: FichePaieResult): FichePaieResult {
    return {
      ...result,
      brut: Math.round(result.brut * 100) / 100,
      cnaps: Math.round(result.cnaps * 100) / 100,
      ostie: Math.round(result.ostie * 100) / 100,
      irsa: Math.round(result.irsa * 100) / 100,
      net: Math.round(result.net * 100) / 100
    };
  }
}
