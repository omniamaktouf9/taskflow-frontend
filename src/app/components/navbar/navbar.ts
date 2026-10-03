import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  menuOuvert: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}