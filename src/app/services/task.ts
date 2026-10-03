import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth';

export interface Tag {
  id?: number;
  nom: string;
}

export interface SubTask {
  id?: number;
  titre: string;
  complete: boolean;
}

export interface TaskActivity {
  id?: number;
  action: string;
  ancienneValeur: string | null;
  nouvelleValeur: string | null;
  dateCreation: string;
}

export interface Project {
  id?: number;
  nom: string;
  description: string;
}

export interface Task {
  id?: number;
  titre: string;
  description: string;
  statut: string;
  priorite: string;
  dateEcheance: string;
  tags?: Tag[];
  subTasks?: SubTask[];
  activities?: TaskActivity[];
  dependencies?: Task[];
  project?: Project | null;
  bloquee?: boolean;
}

interface TaskResponse {
  task: Task;
  bloquee: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private tagsUrl = 'http://localhost:8080/api/tags';
  private subtasksUrl = 'http://localhost:8080/api/subtasks';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllTasks(projectId?: number): Observable<Task[]> {
    const url = projectId ? `${this.apiUrl}?projectId=${projectId}` : this.apiUrl;
    return this.http.get<TaskResponse[]>(url, { headers: this.getHeaders() }).pipe(
      map(responses => responses.map(r => ({ ...r.task, bloquee: r.bloquee })))
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.tagsUrl, { headers: this.getHeaders() });
  }

  addSubTask(taskId: number, titre: string): Observable<SubTask> {
    return this.http.post<SubTask>(`${this.subtasksUrl}/task/${taskId}`, { titre }, { headers: this.getHeaders() });
  }

  toggleSubTask(subTaskId: number): Observable<SubTask> {
    return this.http.put<SubTask>(`${this.subtasksUrl}/${subTaskId}/toggle`, {}, { headers: this.getHeaders() });
  }

  deleteSubTask(subTaskId: number): Observable<void> {
    return this.http.delete<void>(`${this.subtasksUrl}/${subTaskId}`, { headers: this.getHeaders() });
  }
}