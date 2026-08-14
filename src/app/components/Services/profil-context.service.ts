import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Profil } from 'src/app/models/profil';

/**
 * ProfilContextService — source de vérité unique du profil (éleveur) courant.
 *
 * Objectif multi-éleveurs : aujourd'hui le site est mono-éleveur car tout le code
 * lit `environment.id` (= 1, British Kingdom) figé à la compilation. Ce service
 * remplace cette valeur figée par une valeur résolue à l'exécution, à partir du
 * slug présent dans l'URL (ex: eleveurconnect.fr/love-of-british).
 *
 * Rétro-compatibilité : tant qu'aucun slug n'est résolu, `currentProfilId` renvoie
 * `environment.id`. British Kingdom (servi à la racine, sans slug) fonctionne donc
 * exactement comme avant.
 *
 * Branchement (étape suivante) : injecter ce service dans les services de données
 * (CatService, BlogService, LivreOr, Statistique, Contact) et remplacer chaque
 * `environment.id` par `this.profilContext.currentProfilId`. La résolution du slug
 * est déclenchée une seule fois au démarrage via un APP_INITIALIZER (voir init()).
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilContextService {

  /** Profil affiché. Par défaut = British Kingdom (environment.id). */
  private profilId: number = environment.id;

  /** Slug résolu depuis l'URL (null quand on sert le profil par défaut). */
  private slug: string | null = null;

  /** Fiche du profil courant si elle a été récupérée. */
  private profil: Profil | null = null;

  constructor(private http: HttpClient) {}

  /** Identifiant du profil à utiliser dans les appels API. */
  get currentProfilId(): number {
    return this.profilId;
  }

  get currentSlug(): string | null {
    return this.slug;
  }

  get currentProfil(): Profil | null {
    return this.profil;
  }

  setProfilId(id: number): void {
    this.profilId = id;
  }

  /**
   * Extrait un slug d'éleveur du chemin d'URL.
   * Renvoie null pour la racine et pour les segments réservés de l'application
   * (routes existantes de British Kingdom, admin, etc.) afin de ne jamais
   * confondre une route interne avec un slug d'éleveur.
   */
  computeSlugFromPath(path: string): string | null {
    if (!path) {
      return null;
    }
    // Retire query string / fragment puis découpe.
    const clean = path.split('?')[0].split('#')[0];
    const first = clean.split('/').filter(Boolean)[0];
    if (!first) {
      return null;
    }
    if (ProfilContextService.RESERVED_SEGMENTS.has(first.toLowerCase())) {
      return null;
    }
    return first.toLowerCase();
  }

  /**
   * Résout le profil correspondant à un slug via l'API backend
   * (GET /api/profil/by-slug/{slug}). En cas d'échec, on conserve le profil
   * par défaut pour ne pas casser l'affichage.
   */
  async resolveBySlug(slug: string): Promise<boolean> {
    try {
      const url = `${environment.apiUrl}profil/by-slug/${encodeURIComponent(slug)}`;
      const profil = await firstValueFrom(this.http.get<Profil>(url));
      if (profil && profil.profilId) {
        this.profil = profil;
        this.profilId = profil.profilId;
        this.slug = slug;
        return true;
      }
    } catch (e) {
      console.warn(`[ProfilContext] slug "${slug}" non résolu, profil par défaut conservé.`, e);
    }
    return false;
  }

  /**
   * Point d'entrée appelé une seule fois au démarrage (APP_INITIALIZER).
   * `path` est fourni pour le SSR (URL de la requête) ; côté navigateur on
   * retombe sur window.location.pathname.
   */
  async init(path?: string): Promise<void> {
    const p = path ?? (typeof window !== 'undefined' ? window.location.pathname : '');
    const slug = this.computeSlugFromPath(p);
    if (slug) {
      await this.resolveBySlug(slug);
    }
  }

  /** Segments d'URL réservés à l'application : jamais interprétés comme un slug. */
  private static readonly RESERVED_SEGMENTS = new Set<string>([
    'admin', 'accueil', 'males', 'femelles', 'chatons', 'blog', 'contact',
    'conditions', 'liste-attente', 'portee', 'mentions-legales',
    'politique-confidentialite', 'assets', 'api'
  ]);
}
