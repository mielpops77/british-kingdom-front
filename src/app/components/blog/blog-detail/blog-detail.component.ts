import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../../Services/blogService';
import { SeoService } from '../../Services/seo.service';
import { BlogPost } from '../../../models/blog-post';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, RouterLink]
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  post: BlogPost | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private blogService: BlogService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.router.navigateByUrl('/blog');
      return;
    }

    this.blogService.getPostBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        const url = `https://chatterie-british-kingdom.fr/blog/${post.slug}`;

        this.title.setTitle(`${post.title} | Chatterie British Kingdom`);
        this.meta.updateTag({ name: 'description', content: post.excerpt });
        this.seo.setCanonical(url);
        this.seo.setOgTags({
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          url
        });
        this.seo.setArticleJsonLd({
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          url,
          datePublished: post.date
        });
      },
      error: () => this.router.navigateByUrl('/blog')
    });
  }

  ngOnDestroy(): void {
    this.seo.removeJsonLd();
    this.seo.setCanonical('https://chatterie-british-kingdom.fr/');
  }

  formaterDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
}
