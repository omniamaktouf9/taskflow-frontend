import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { TaskList } from './components/task-list/task-list';
import { ProjectList } from './components/project-list/project-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'projects', component: ProjectList, canActivate: [authGuard] },
  { path: 'tasks', component: TaskList, canActivate: [authGuard] },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
];