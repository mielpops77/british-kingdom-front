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

/* --------------------------------------------------------------------------
   Les jours seuls (« 2026-10-02 »), pour le carnet de santé : une pesée ou un
   vaccin n'ont pas d'heure, et un jour doit rester le même jour partout.
   -------------------------------------------------------------------------- */

/** Le repère interne d'un jour : minuit UTC, quel que soit le fuseau de l'appareil. */
function jourUTC(iso: string | null | undefined): number {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(iso || '').trim());
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(String(iso));
  if (isNaN(d.getTime())) return NaN;
  const [a, mo, j] = jourDe(d).split('-').map(Number);
  return Date.UTC(a, mo - 1, j);
}

/** « 2026-10-02 » : le jour qu'il est à Paris, prêt pour un <input type="date">. */
export function aujourdhuiISO(): string {
  return jourDe(new Date());
}

/** Le nombre de jours entiers de `debut` à `fin` (négatif si `fin` est avant). */
export function joursEntre(debut: string | null | undefined, fin: string | null | undefined): number {
  const a = jourUTC(debut), b = jourUTC(fin);
  return isNaN(a) || isNaN(b) ? NaN : Math.round((b - a) / 86400000);
}

/** La même date, `annees` plus tard : « 2026-10-02 » → « 2027-10-02 ». */
export function dansDesAnnees(iso: string | null | undefined, annees: number): string {
  const t = jourUTC(iso);
  if (isNaN(t)) return '';
  const d = new Date(t);
  d.setUTCFullYear(d.getUTCFullYear() + annees);
  return d.toISOString().slice(0, 10);
}

/** « aujourd'hui », « hier », « demain », « jeu. 2 oct. », et l'année si ce n'est pas celle-ci. */
export function jourLisible(iso: string | null | undefined): string {
  const t = jourUTC(iso);
  if (isNaN(t)) return '';
  const ecart = joursEntre(aujourdhuiISO(), iso);
  if (ecart === 0) return "aujourd'hui";
  if (ecart === -1) return 'hier';
  if (ecart === 1) return 'demain';

  const d = new Date(t);
  const memeAnnee = String(aujourdhuiISO()).slice(0, 4) === String(iso).slice(0, 4);
  return new Intl.DateTimeFormat('fr-FR', memeAnnee
    ? { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short' }
    : { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}
