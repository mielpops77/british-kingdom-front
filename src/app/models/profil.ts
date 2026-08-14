export interface Profil {
  id: number;
  profilId?: number;    // Identifiant de tenant (éleveur) — renvoyé par le backend
  domaineName?: string; // Slug de démo / nom de domaine — renvoyé par le backend
  firstName: string;
  lastName: string; // Utilisez une chaîne de caractères ou une date, en fonction de la manière dont vous souhaitez gérer les dates
  phoneNumber: string;
  userType: string;
  siren: string;
  facebook: string;
  instagram: string;
  twitter: string;
  email: string;
  tiktok: string;
  youtube: string;
}

