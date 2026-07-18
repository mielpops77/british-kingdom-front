import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { BlogService } from '../../Services/blogService';
import { BlogPost } from '../../../models/blog-post';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, RouterLink]
})
export class BlogDetailComponent implements OnInit {
  post: BlogPost | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private blogService: BlogService,
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
        this.title.setTitle(`${post.title} | Chatterie British Kingdom`);
        this.meta.updateTag({ name: 'description', content: post.excerpt });
      },
      error: () => this.router.navigateByUrl('/blog')
    });
  }

  formaterDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
}
