import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService, Project } from '../../services/project';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList implements OnInit {
  projects: Project[] = [];
  editingId: number | null = null;

  newProject: Project = {
    nom: '',
    description: ''
  };

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur chargement projets:', err)
    });
  }

  addProject(): void {
    if (!this.newProject.nom.trim()) {
      return;
    }

    if (this.editingId !== null) {
      this.projectService.updateProject(this.editingId, this.newProject).subscribe({
        next: () => {
          this.loadProjects();
          this.resetForm();
        },
        error: (err) => console.error('Erreur mise à jour projet:', err)
      });
    } else {
      this.projectService.createProject(this.newProject).subscribe({
        next: () => {
          this.loadProjects();
          this.resetForm();
        },
        error: (err) => console.error('Erreur création projet:', err)
      });
    }
  }

  editProject(project: Project): void {
    this.editingId = project.id ?? null;
    this.newProject = {
      nom: project.nom,
      description: project.description
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
    this.newProject = { nom: '', description: '' };
  }

  deleteProject(id: number | undefined): void {
    if (!id) return;
    this.projectService.deleteProject(id).subscribe({
      next: () => this.loadProjects(),
      error: (err) => console.error('Erreur suppression projet:', err)
    });
  }

  ouvrirProjet(projectId: number | undefined): void {
    if (!projectId) return;
    this.router.navigate(['/tasks'], { queryParams: { projectId } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}