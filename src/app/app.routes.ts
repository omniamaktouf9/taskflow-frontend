import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { TaskList } from './components/task-list/task-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'tasks', component: TaskList, canActivate: [authGuard] },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];