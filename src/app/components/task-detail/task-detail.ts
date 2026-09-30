import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css'
})
export class TaskDetail {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  nouvelleSousTache: string = '';

  constructor(private taskService: TaskService) {}

  get progression(): number {
    if (!this.task.subTasks || this.task.subTasks.length === 0) {
      return 0;
    }
    const completees = this.task.subTasks.filter(st => st.complete).length;
    return Math.round((completees / this.task.subTasks.length) * 100);
  }

  get nombreCompletees(): number {
    return this.task.subTasks ? this.task.subTasks.filter(st => st.complete).length : 0;
  }

  ajouterSousTache(): void {
    if (!this.nouvelleSousTache.trim() || !this.task.id) {
      return;
    }
    this.taskService.addSubTask(this.task.id, this.nouvelleSousTache).subscribe({
      next: () => {
        this.nouvelleSousTache = '';
        this.refresh.emit();
      },
      error: (err) => console.error('Erreur ajout sous-tâche:', err)
    });
  }

  toggleSousTache(subTaskId: number | undefined): void {
    if (!subTaskId) return;
    this.taskService.toggleSubTask(subTaskId).subscribe({
      next: () => this.refresh.emit(),
      error: (err) => console.error('Erreur toggle sous-tâche:', err)
    });
  }

  supprimerSousTache(subTaskId: number | undefined): void {
    if (!subTaskId) return;
    this.taskService.deleteSubTask(subTaskId).subscribe({
      next: () => this.refresh.emit(),
      error: (err) => console.error('Erreur suppression sous-tâche:', err)
    });
  }

  fermer(): void {
    this.close.emit();
  }
}