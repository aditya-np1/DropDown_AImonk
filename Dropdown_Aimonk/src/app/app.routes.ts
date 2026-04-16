import { Routes } from '@angular/router';
import { MainCanvas } from './main-canvas/main-canvas';
 
export const routes: Routes = [
  { path: '', component: MainCanvas },
  { path: '**', redirectTo: '' }
];
