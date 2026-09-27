import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  isRegisterMode = false;

  email = '';
  password = '';
  nom = '';

  errorMessage = '';
  infoMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.infoMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      }
    });
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.isRegisterMode) {
      this.authService.register({ email: this.email, password: this.password, nom: this.nom }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'inscription. Cet email est peut-être déjà utilisé.';
          console.error(err);
        }
      });
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = 'Email ou mot de passe incorrect.';
          console.error(err);
        }
      });
    }
  }
}