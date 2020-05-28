import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToDoInputComponent } from './to-do-input/to-do-list.component';
import { ToDoComponent } from './to-do/to-do.component';

const routes: Routes = [
  {
    path: 'to-do',
    component: ToDoComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'to-do',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
