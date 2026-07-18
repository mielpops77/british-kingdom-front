import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../components/Services/blogService';
import { CatService } from '../../../components/Services/catService';
import { BlogPost, BlogPostBlock } from '../../../models/blog-post';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink]
})
export class BlogFormComponent implements OnInit {
  isEdit = false;
  postId: number | null = null;

  title = '';
  slug = '';
  category = '';
  excerpt = '';
  coverImage = '';
  date = new Date().toISOString().substring(0, 10);
  readingTime = 3;
  contentText = '';

  slugTouched = false;
  uploadingCover = false;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private catService: CatService,
  ) { }

  ngOnInit(): void {
    const slugParam = this.route.snapshot.paramMap.get('slug');

    if (slugParam) {
      this.isEdit = true;
      this.slugTouched = true;

      this.blogService.getPostBySlug(slugParam).subscribe({
        next: (post) => {
          this.postId = post.id!;
          this.title = post.title;
          this.slug = post.slug;
          this.category = post.category;
          this.excerpt = post.excerpt;
          this.coverImage = post.coverImage;
          this.date = post.date;
          this.readingTime = post.readingTime;
          this.contentText = this.blocksToText(post.content);
        },
        error: () => this.error = "Impossible de charger cet article."
      });
    }
  }

  onTitleChange(): void {
    if (!this.slugTouched) {
      this.slug = this.slugify(this.title);
    }
  }

  onSlugEdited(): void {
    this.slugTouched = true;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  onCoverSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingCover = true;
    this.catService.uploadImages('Blog', [file]).subscribe({
      next: (res) => {
        this.coverImage = res.uploadedFilePaths[0];
        this.uploadingCover = false;
      },
      error: () => {
        this.error = "L'upload de la photo a échoué.";
        this.uploadingCover = false;
      }
    });
  }

  private blocksToText(blocks: BlogPostBlock[]): string {
    return blocks.map(b => {
      if (b.type === 'h2') return `## ${b.text}`;
      if (b.type === 'quote') return `> ${b.text}`;
      return b.text;
    }).join('\n\n');
  }

  private parseContent(text: string): BlogPostBlock[] {
    const lines = text.split('\n');
    const blocks: BlogPostBlock[] = [];
    let currentParagraph: string[] = [];

    const flush = () => {
      if (currentParagraph.length) {
        blocks.push({ type: 'p', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flush();
      } else if (trimmed.startsWith('## ')) {
        flush();
        blocks.push({ type: 'h2', text: trimmed.substring(3).trim() });
      } else if (trimmed.startsWith('> ')) {
        flush();
        blocks.push({ type: 'quote', text: trimmed.substring(2).trim() });
      } else {
        currentParagraph.push(trimmed);
      }
    }
    flush();
    return blocks;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.coverImage) {
      this.error = !this.coverImage ? "Ajoute une photo de couverture." : '';
      return;
    }

    const post: BlogPost = {
      slug: this.slug,
      title: this.title,
      excerpt: this.excerpt,
      category: this.category,
      coverImage: this.coverImage,
      date: this.date,
      readingTime: this.readingTime,
      content: this.parseContent(this.contentText),
    };

    this.saving = true;
    this.error = '';

    const action = this.isEdit
      ? this.blogService.updatePost(this.postId!, post)
      : this.blogService.createPost(post);

    action.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigateByUrl('/admin/blog');
      },
      error: () => {
        this.saving = false;
        this.error = "L'enregistrement a échoué.";
      }
    });
  }
}
