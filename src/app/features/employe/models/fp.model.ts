export interface Avantage {
    nom: string;
    montant: number;
}

export interface FichePaieInput {
    nom: string;
    poste: string;
    salaireBase: number;
    prime?: number;
    heureSup?: number;
    salaireheureSup?: number;
    indemnite?: number;
    autresAvantages?: Avantage[];  // <-- tableau d'objets maintenant
    nbCharge?: number;
    congesPris?: number;
    joursOuvrablesParMois?: number;
}

export interface FichePaieResult {
    nom: string;
    poste: string;
    brut: number;
    cnaps: number;
    ostie: number;
    irsa: number;
    net: number;
    congesPris?: number;
    joursOuvrablesParMois?: number;
    salaireBase?: number;
    salaireheureSup?: number;
    prime?: number;
    heureSup?: number;
    indemnite?: number;
    autresAvantages?: Avantage[];
    nbCharge?: number;
}
