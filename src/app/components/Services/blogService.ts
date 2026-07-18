import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogPost } from 'src/app/models/blog-post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<BlogPost[]> {
    const params = { profilId: environment.id.toString() };
    return this.http.get<BlogPost[]>(environment.apiUrlBlog, { params });
  }

  getPostBySlug(slug: string): Observable<BlogPost> {
    const params = { profilId: environment.id.toString() };
    return this.http.get<BlogPost>(`${environment.apiUrlBlog}${slug}`, { params });
  }

  createPost(post: BlogPost): Observable<any> {
    return this.http.post<any>(environment.apiUrlBlog, { ...post, profilId: environment.id });
  }

  updatePost(id: number, post: BlogPost): Observable<any> {
    return this.http.put<any>(`${environment.apiUrlBlog}${id}`, { ...post, profilId: environment.id });
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrlBlog}${id}`);
  }
}
