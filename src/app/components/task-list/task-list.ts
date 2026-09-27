import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  editingId: number | null = null;

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tâches:', err);
      }
    });
  }

  addTask(): void {
    if (!this.newTask.titre.trim()) {
      return;
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
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
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
}