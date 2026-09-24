/**
 * D'où vient une demande.
 *
 * Quand quelqu'un arrive par un lien étiqueté (chatterie-british-kingdom.fr/tiktok,
 * /instagram, /facebook, /youtube…), le site retient le nom du réseau et l'écrit au
 * bas du message : « Arrivé par : TikTok » (voir site-v2/js/site.js).
 * Ici on relit cette ligne pour l'afficher à part, et on la retire du corps du message
 * pour qu'elle ne gêne pas la lecture.
 */

const LIGNE = /^[ \t]*Arriv[ée] par[ \t]*:[ \t]*(.+?)[ \t]*$/im;

/** « TikTok », « Recherche Google »… ou '' quand on ne sait pas. */
export function provenanceDe(message: string | null | undefined): string {
  const m = String(message || '').match(LIGNE);
  return m ? m[1].trim() : '';
}

/** Le message tel qu'on veut le lire, sans la ligne de provenance. */
export function sansProvenance(message: string | null | undefined): string {
  return String(message || '').replace(LIGNE, '').replace(/\n{3,}/g, '\n\n').trim();
}
