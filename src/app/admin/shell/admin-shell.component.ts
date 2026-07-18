import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet]
})
export class AdminShellComponent {

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
