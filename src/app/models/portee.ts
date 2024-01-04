import { Chaton } from "./chaton";

export interface Portee {
    id: number;
    name:string;
    idPapa: number;
    idMaman: number;
    dateOfBirth: string;
    dateOfSell: string;
    chatons: Chaton[];
    profilId: number;
    urlProfilMother: string;
    urlProfilFather: string;
    disponible: boolean;

  }
  
  
  
  
  
  