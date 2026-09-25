import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NgIf, NgFor, DatePipe, isPlatformBrowser } from '@angular/common';
import { MARQUE_MAISON } from '../shell/admin-shell.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StatistiqueService } from '../../components/Services/statistique.service';
import { ContactService } from '../../components/Services/contact.service';
import { provenanceDe } from '../services/provenance';

interface Stats {
  nbrVisitesTotal: number;
  nbrVisitesJour: number;
}

interface DailyBar {
  date: Date;
  count: number;
  heightPercent: number;
  jourCourt: string;   // « lun »
  numero: number;      // 22
  aujourdhui: boolean;
}

interface LocationStat {
  location: string;
  count: number;
  percent: number;
}

/** Un réseau et le nombre de demandes qui en viennent. */
interface SourceStat {
  nom: string;
  count: number;
  percent: number;
}

/** Un lien étiqueté à poser sur un réseau. */
interface LienReseau {
  reseau: string;
  ou: string;
  chemin: string;
  lien: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: Stats | undefined;
  loading = true;
  recentVisits: { visitedAt: Date; location: string | null; device: string; isBot: boolean; visitorIp: string | null; source: string | null }[] = [];
  loadingVisits = true;
  dailyBars: DailyBar[] = [];
  loadingDaily = true;

  /** De quoi lire le graphique d'un coup d'œil. */
  totalPeriode = 0;
  moyenneParJour = 0;
  meilleurJour: { count: number; jour: string; aujourdhui: boolean } | null = null;
  total7 = 0;
  tendance: number | null = null;   // en % par rapport aux 14 jours d'avant

  /** Les visites du quotidien : les robots et les adresses techniques restent de côté. */
  afficherRobots = false;
  afficherIp = false;

  private readonly JOURS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  private readonly JOURS_LONGS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  private readonly MOIS = ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  topLocations: LocationStat[] = [];
  loadingLocations = true;
  onlineCount = 0;
  loadingOnline = true;
  private onlineInterval: any;

  /** Les visites de ce navigateur sont-elles mises de côté ? */
  mesVisitesComptees = false;

  /** Par quel réseau les visiteurs sont arrivés (toutes les visites des 30 derniers jours). */
  visiteurs: SourceStat[] = [];
  loadingVisiteurs = true;

  /** Par quel réseau les familles qui écrivent sont arrivées. */
  sources: SourceStat[] = [];
  demandesAvecProvenance = 0;
  demandesTotal = 0;
  loadingSources = true;

  /** Les liens à poser sur chaque réseau : courts, jolis, et étiquetés. */
  readonly domaine = 'chatterie-british-kingdom.fr';
  readonly liens: LienReseau[] = [
    { reseau: 'Instagram', ou: 'bio', chemin: '/instagram', lien: 'https://chatterie-british-kingdom.fr/instagram' },
    { reseau: 'TikTok', ou: 'bio', chemin: '/tiktok', lien: 'https://chatterie-british-kingdom.fr/tiktok' },
    { reseau: 'Facebook', ou: 'page', chemin: '/facebook', lien: 'https://chatterie-british-kingdom.fr/facebook' },
    { reseau: 'YouTube', ou: 'vidéos', chemin: '/youtube', lien: 'https://chatterie-british-kingdom.fr/youtube' },
  ];
  lienCopie = '';

  constructor(
    private http: HttpClient,
    private statistiqueService: StatistiqueService,
    private contactService: ContactService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  /** « aujourd'hui à 07:47 », « hier à 22:14 », sinon « lun 22 sept. à 14:03 ». */
  dateLisible(d: Date): string {
    const heure = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const jour = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const aujourdhui = new Date();
    const zeroAujourdhui = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate()).getTime();
    const ecart = Math.round((zeroAujourdhui - jour) / 86400000);

    if (ecart === 0) return 'aujourd\'hui à ' + heure;
    if (ecart === 1) return 'hier à ' + heure;
    return this.JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + this.MOIS[d.getMonth()] + ' à ' + heure;
  }

  /** Les visites montrées dans la liste : sans les robots, sauf si on les demande. */
  get visitesAffichees() {
    return this.afficherRobots ? this.recentVisits : this.recentVisits.filter(v => !v.isBot);
  }

  get nbRobots(): number {
    return this.recentVisits.filter(v => v.isBot).length;
  }

  /** Le lien sans le « https:// », plus court à lire. */
  affiche(lien: string): string {
    return lien.replace(/^https?:\/\//, '');
  }

  /** Copie le lien pour le coller dans la bio du réseau. */
  copier(l: LienReseau): void {
    const fini = () => {
      this.lienCopie = l.reseau;
      setTimeout(() => { if (this.lienCopie === l.reseau) this.lienCopie = ''; }, 2500);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(l.lien).then(fini, () => this.copierAutrement(l.lien, fini));
        return;
      }
    } catch (e) { /* presse-papier refusé */ }
    this.copierAutrement(l.lien, fini);
  }

  /** Repli pour les navigateurs qui refusent le presse-papier moderne. */
  private copierAutrement(texte: string, fini: () => void): void {
    try {
      const champ = document.createElement('textarea');
      champ.value = texte;
      champ.setAttribute('readonly', '');
      champ.style.position = 'fixed';
      champ.style.opacity = '0';
      document.body.appendChild(champ);
      champ.select();
      document.execCommand('copy');
      document.body.removeChild(champ);
      fini();
    } catch (e) { /* tant pis : le lien reste lisible à l'écran */ }
  }

  /** Compter (ou non) les visites faites depuis ce navigateur. */
  basculerMesVisites(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(MARQUE_MAISON, this.mesVisitesComptees ? '1' : '0');
      this.mesVisitesComptees = !this.mesVisitesComptees;
    } catch (e) { /* stockage refusé */ }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      try { this.mesVisitesComptees = localStorage.getItem(MARQUE_MAISON) === '0'; } catch (e) { /* stockage refusé */ }
    }
    this.refreshOnlineCount();
    this.onlineInterval = setInterval(() => this.refreshOnlineCount(), 20000);

    this.http.get<Stats>(`${environment.apiUrl}statistique/${environment.id}`).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.statistiqueService.getRecentVisits(environment.id).subscribe({
      next: (visits) => {
        this.recentVisits = visits.map(v => ({ visitedAt: new Date(v.visitedAt), location: v.location, device: v.device, isBot: v.isBot, visitorIp: v.visitorIp, source: v.source || null }));
        this.loadingVisits = false;
      },
      error: () => {
        this.loadingVisits = false;
      }
    });

    // On demande quatre semaines : deux pour le graphique, deux pour la comparaison.
    this.statistiqueService.getDailyStats(environment.id, 28).subscribe({
      next: (days) => {
        const quinzaine = days.slice(-14);
        const precedente = days.slice(0, Math.max(0, days.length - 14));
        const maxCount = Math.max(1, ...quinzaine.map(d => d.count));
        const aujourdhui = new Date().toDateString();

        this.dailyBars = quinzaine.map(d => {
          const date = new Date(d.date);
          return {
            date,
            count: d.count,
            heightPercent: Math.round((d.count / maxCount) * 100),
            jourCourt: this.JOURS[date.getDay()],
            numero: date.getDate(),
            aujourdhui: date.toDateString() === aujourdhui,
          };
        });

        const somme = (liste: { count: number }[]) => liste.reduce((t, d) => t + d.count, 0);
        this.totalPeriode = somme(quinzaine);
        this.moyenneParJour = quinzaine.length ? Math.round(this.totalPeriode / quinzaine.length) : 0;
        this.total7 = somme(quinzaine.slice(-7));

        const champion = this.dailyBars.reduce<DailyBar | null>((meilleur, b) => (!meilleur || b.count > meilleur.count ? b : meilleur), null);
        this.meilleurJour = champion && champion.count > 0
          ? {
              count: champion.count,
              jour: this.JOURS_LONGS[champion.date.getDay()] + ' ' + champion.date.getDate(),
              aujourdhui: champion.aujourdhui,
            }
          : null;

        const avant = somme(precedente);
        this.tendance = precedente.length === 14 && avant > 0
          ? Math.round(((this.totalPeriode - avant) / avant) * 100)
          : null;

        this.loadingDaily = false;
      },
      error: () => {
        this.loadingDaily = false;
      }
    });

    this.statistiqueService.getTopSources(environment.id, 30, 8).subscribe({
      next: (sources) => {
        const max = Math.max(1, ...sources.map(s => s.count));
        this.visiteurs = sources.map(s => ({ nom: s.source, count: s.count, percent: Math.round((s.count / max) * 100) }));
        this.loadingVisiteurs = false;
      },
      error: () => {
        this.loadingVisiteurs = false;
      }
    });

    this.contactService.getAllContacts(environment.id).subscribe({
      next: (contacts) => {
        const compte = new Map<string, number>();
        contacts.forEach(c => {
          const nom = provenanceDe(c.message);
          if (nom) compte.set(nom, (compte.get(nom) || 0) + 1);
        });
        const total = Array.from(compte.values()).reduce((a, b) => a + b, 0);
        const max = Math.max(1, ...compte.values());
        this.sources = Array.from(compte.entries())
          .map(([nom, count]) => ({ nom, count, percent: Math.round((count / max) * 100) }))
          .sort((a, b) => b.count - a.count);
        this.demandesAvecProvenance = total;
        this.demandesTotal = contacts.length;
        this.loadingSources = false;
      },
      error: () => {
        this.loadingSources = false;
      }
    });

    this.statistiqueService.getTopLocations(environment.id, 30, 5).subscribe({
      next: (locations) => {
        const maxCount = Math.max(1, ...locations.map(l => l.count));
        this.topLocations = locations.map(l => ({
          location: l.location,
          count: l.count,
          percent: Math.round((l.count / maxCount) * 100)
        }));
        this.loadingLocations = false;
      },
      error: () => {
        this.loadingLocations = false;
      }
    });
  }

  refreshOnlineCount(): void {
    this.statistiqueService.getOnlineCount(environment.id).subscribe({
      next: (res) => {
        this.onlineCount = res.online;
        this.loadingOnline = false;
      },
      error: () => {
        this.loadingOnline = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.onlineInterval) {
      clearInterval(this.onlineInterval);
    }
  }
}
