export interface Contact {
    id: number;
    profilId: number;
    name: string;
    message: string; // Utilisez une chaîne de caractères ou une date, en fonction de la manière dont vous souhaitez gérer les dates
    subject: string;
    email: string;
    num: string;
    vue : Boolean;
    /** A-t-on déjà répondu ? Absent tant que le moteur ne le sait pas. */
    repondu?: boolean;
    dateofCrea: string;
    hour: string;


}

