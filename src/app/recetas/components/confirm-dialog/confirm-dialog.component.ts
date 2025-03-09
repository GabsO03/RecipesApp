import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Recipe } from '../../interfaces/receta.interface';
import { delay } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styles: ``
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<Recipe>(MAT_DIALOG_DATA);
  public animar: boolean = false;

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.animar = true;
    setTimeout(() => {
      this.dialogRef.close(true);
      this.animar = false;
    }, 2500);
  }
}
