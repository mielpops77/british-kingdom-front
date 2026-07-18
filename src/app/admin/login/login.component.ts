import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.loading = false;
        this.error = 'Email ou mot de passe incorrect.';
      }
    });
  }
}
