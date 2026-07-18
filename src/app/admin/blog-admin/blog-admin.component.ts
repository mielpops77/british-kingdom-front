import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../components/Services/blogService';
import { BlogPost } from '../../models/blog-post';

@Component({
  selector: 'app-admin-blog',
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, RouterLink]
})
export class BlogAdminComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  deletingId: number | null = null;

  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  confirmDelete(post: BlogPost): void {
    if (!post.id || !confirm(`Supprimer l'article "${post.title}" ?`)) return;

    this.deletingId = post.id;
    this.blogService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
        this.deletingId = null;
      },
      error: () => {
        alert('La suppression a échoué.');
        this.deletingId = null;
      }
    });
  }
}
