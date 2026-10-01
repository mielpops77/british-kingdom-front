/**
 * Les dates telles qu'on les dit : « aujourd'hui à 22:35 », « hier à 09:12 »,
 * sinon « mer. 24 sept. à 22:35 ». Toujours à l'heure de Paris, quelle que soit
 * l'heure de l'appareil qui regarde.
 *
 * `heure` ("HH:mm", le champ `hour` des contacts) sert de secours : certaines fiches
 * anciennes n'ont qu'une date, sans l'heure, et afficheraient minuit.
 */

const PARIS = 'Europe/Paris';

const jourDe = (d: Date) =>
  new Intl.DateTimeFormat('fr-CA', { timeZone: PARIS, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

export function dateLisible(iso: string | null | undefined, heure?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);

  // Une fiche enregistrée sans heure vaut minuit pile : à Paris elle s'afficherait « 02:00 »,
  // une heure inexacte annoncée avec aplomb. Dans ce cas on préfère le champ `hour`.
  const sansHeure = /T00:00(:00)?(\.0+)?(Z|\+00:?00)?$/.test(String(iso).trim());
  let hhmm = sansHeure && heure && /^\d{1,2}:\d{2}/.test(heure)
    ? heure.slice(0, 5).padStart(5, '0')
    : new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS, hour: '2-digit', minute: '2-digit' }).format(d);

  const jour = jourDe(d);
  if (jour === jourDe(new Date())) return "aujourd'hui à " + hhmm;
  if (jour === jourDe(new Date(Date.now() - 86400000))) return 'hier à ' + hhmm;

  const date = new Intl.DateTimeFormat('fr-FR', { timeZone: PARIS, weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  return date + ' à ' + hhmm;
}
