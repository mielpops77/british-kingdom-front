import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../Services/blogService';
import { SeoService } from '../Services/seo.service';
import { BlogPost } from '../../models/blog-post';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink]
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];

  constructor(private blogService: BlogService, private title: Title, private meta: Meta, private seo: SeoService) { }

  ngOnInit(): void {
    this.title.setTitle('Blog | Chatterie British Kingdom');
    this.meta.updateTag({ name: 'description', content: "Conseils, actualités et vie de la chatterie British Kingdom : tout sur les chats British Shorthair et British Longhair." });
    this.seo.setCanonical('https://chatterie-british-kingdom.fr/blog');

    this.blogService.getAllPosts().subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error('Error loading blog posts', err)
    });
  }

  get featured(): BlogPost {
    return this.posts[0];
  }

  get others(): BlogPost[] {
    return this.posts.slice(1);
  }

  formaterDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
}
