import { isDevMode } from '@angular/core';

export const API_URL = isDevMode()
  ? 'http://localhost:8080'
  : 'https://taskflow-backend-ymid.onrender.com';