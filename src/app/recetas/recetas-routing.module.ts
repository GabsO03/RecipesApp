import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { RecetaPageComponent } from './pages/receta-page/receta-page.component';
import { RoleGuard } from '../auth/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'new-recipe', component: NewPageComponent,         canActivate: [RoleGuard]},
      { path: 'search', component: SearchPageComponent},
      { path: 'edit/:id', component: NewPageComponent,         canActivate: [RoleGuard]},
      { path: 'list', component: ListPageComponent},
      { path: ':id', component: RecetaPageComponent},
      { path: '**', redirectTo:'list'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecetasRoutingModule { }
