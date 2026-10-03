import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService, Task } from '../../services/task';
import { AuthService } from '../../services/auth';
import { TaskDetail } from '../task-detail/task-detail';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule, TaskDetail],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  editingId: number | null = null;
  statutFiltre: string = 'TOUS';
  prioriteFiltre: string = 'TOUTES';
  rechercheTitre: string = '';
  triCroissant: boolean = true;
  tagsInput: string = '';
  dependencyIds: number[] = [];
  dependancesOuvertes: boolean = false;
  tacheSelectionnee: Task | null = null;
  projectId: number | null = null;

  newTask: Task = {
    titre: '',
    description: '',
    statut: 'A_FAIRE',
    priorite: 'MOYENNE',
    dateEcheance: ''
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'] ? Number(params['projectId']) : null;
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskService.getAllTasks(this.projectId ?? undefined).subscribe({
      next: (data) => {
        this.tasks = [...data];
        if (this.tacheSelectionnee) {
          this.tacheSelectionnee = this.tasks.find(t => t.id === this.tacheSelectionnee!.id) ?? null;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches:', err);
      }
    });
  }

  retourProjets(): void {
    this.router.navigate(['/projects']);
  }

  ouvrirDetail(task: Task): void {
    this.tacheSelectionnee = task;
  }

  fermerDetail(): void {
    this.tacheSelectionnee = null;
  }

  private parseTagsInput(): { nom: string }[] {
    return this.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(nom => ({ nom }));
  }

  toggleDependency(taskId: number | undefined, event: Event): void {
    if (!taskId) return;
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.dependencyIds.push(taskId);
    } else {
      this.dependencyIds = this.dependencyIds.filter(id => id !== taskId);
    }
  }

  isDependencySelected(taskId: number | undefined): boolean {
    return taskId !== undefined && this.dependencyIds.includes(taskId);
  }

  toggleDependancesOuvertes(): void {
    this.dependancesOuvertes = !this.dependancesOuvertes;
  }

  addTask(): void {
    if (!this.newTask.titre.trim()) {
      return;
    }

    this.newTask.tags = this.parseTagsInput();
    this.newTask.dependencies = this.dependencyIds.map(id => ({ id } as Task));

    if (this.projectId) {
      this.newTask.project = { id: this.projectId } as any;
    }

    if (this.editingId !== null) {
      this.taskService.updateTask(this.editingId, this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
        }
      });
    } else {
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
        }
      });
    }
  }

  editTask(task: Task): void {
    this.editingId = task.id ?? null;
    this.newTask = {
      titre: task.titre,
      description: task.description,
      statut: task.statut,
      priorite: task.priorite,
      dateEcheance: task.dateEcheance
    };
    this.tagsInput = task.tags ? task.tags.map(t => t.nom).join(', ') : '';
    this.dependencyIds = task.dependencies ? task.dependencies.map(d => d.id!).filter(id => id !== undefined) : [];

    setTimeout(() => {
      document.getElementById('form-titre')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
    this.tagsInput = '';
    this.dependencyIds = [];
    this.dependancesOuvertes = false;
    this.newTask = {
      titre: '',
      description: '',
      statut: 'A_FAIRE',
      priorite: 'MOYENNE',
      dateEcheance: ''
    };
  }

  deleteTask(id: number | undefined): void {
    if (!id) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTri(): void {
    this.triCroissant = !this.triCroissant;
  }

  get autresTaches(): Task[] {
    return this.tasks.filter(t => t.id !== this.editingId);
  }

  getTitresDependancesNonTerminees(task: Task): string {
    if (!task.dependencies) return '';
    return task.dependencies
      .filter(d => d.statut !== 'TERMINE')
      .map(d => d.titre)
      .join(', ');
  }

  get tasksFiltrees(): Task[] {
    let resultat = this.tasks;

    if (this.statutFiltre !== 'TOUS') {
      resultat = resultat.filter(task => task.statut === this.statutFiltre);
    }

    if (this.prioriteFiltre !== 'TOUTES') {
      resultat = resultat.filter(task => task.priorite === this.prioriteFiltre);
    }

    if (this.rechercheTitre.trim() !== '') {
      const recherche = this.rechercheTitre.toLowerCase();
      resultat = resultat.filter(task => task.titre.toLowerCase().includes(recherche));
    }

    resultat = [...resultat].sort((a, b) => {
      const dateA = new Date(a.dateEcheance).getTime();
      const dateB = new Date(b.dateEcheance).getTime();
      return this.triCroissant ? dateA - dateB : dateB - dateA;
    });

    return resultat;
  }
}