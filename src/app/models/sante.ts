/**
 * Le carnet de santé de l'élevage. Deux usages, une seule forme :
 *  - une pesée de chaton  : categorie « poids », poids en grammes ;
 *  - un vaccin de reproducteur : categorie « vaccin », libelle + rappel prévu.
 *
 * Les dates voyagent en « 2026-10-02 » (sans heure, sans fuseau) : un jour reste
 * le même jour, où que soit l'appareil qui regarde.
 */
export interface LigneSante {
  id: number;
  profilId: number;
  espece: 'chaton' | 'chat';
  animalId: number;
  categorie: 'poids' | 'vaccin';
  dateFait: string;
  poids?: number | null;
  libelle?: string | null;
  rappel?: string | null;
  note?: string | null;
}
