import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private jsonLdId = 'dynamic-structured-data';

  constructor(@Inject(DOCUMENT) private doc: Document, private meta: Meta) { }

  setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  setOgTags(tags: { title: string; description: string; image?: string; url: string }): void {
    this.meta.updateTag({ property: 'og:title', content: tags.title });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:url', content: tags.url });
    if (tags.image) {
      this.meta.updateTag({ property: 'og:image', content: tags.image });
    }
    this.meta.updateTag({ name: 'twitter:title', content: tags.title });
    this.meta.updateTag({ name: 'twitter:description', content: tags.description });
    if (tags.image) {
      this.meta.updateTag({ name: 'twitter:image', content: tags.image });
    }
  }

  setArticleJsonLd(data: {
    title: string;
    description: string;
    image: string;
    url: string;
    datePublished: string;
  }): void {
    this.removeJsonLd();

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = this.jsonLdId;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      author: {
        '@type': 'Organization',
        name: 'Chatterie British Kingdom'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Chatterie British Kingdom',
        logo: {
          '@type': 'ImageObject',
          url: 'https://chatterie-british-kingdom.fr/assets/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url
      }
    });
    this.doc.head.appendChild(script);
  }

  removeJsonLd(): void {
    const existing = this.doc.getElementById(this.jsonLdId);
    if (existing) {
      existing.remove();
    }
  }
}
