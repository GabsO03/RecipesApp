import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecetasRoutingModule } from './recetas-routing.module';
import { RecetaPageComponent } from './pages/receta-page/receta-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { RecetasService } from './services/recetas.service';
import { CardComponent } from './components/card/card.component';
import { RecipeImagePipe } from './pipes/recipe-image.pipe';
import { CapitalizeWordPipe } from './pipes/category-capital.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { IngredientPipe } from './pipes/ingredient.pipe';
import { DescripcionPipe } from './pipes/descripcion.pipe';


@NgModule({
  declarations: [
    RecetaPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    SearchPageComponent,
    NewPageComponent,
    CardComponent,
    RecipeImagePipe,
    CapitalizeWordPipe,
    ConfirmDialogComponent,
    IngredientPipe,
    DescripcionPipe,
  ],
  imports: [
    CommonModule,
    RecetasRoutingModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class RecetasModule { }