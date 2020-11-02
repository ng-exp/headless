import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuExampleComponent } from './menu-example/menu-example.component';

const routes: Routes = [
  {
    path: 'menu-example',
    component: MenuExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
