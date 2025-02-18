import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

import { ICategory } from '../../../category/interfaces/ICategory';
import { CategoryListComponent } from "../../../category/components/category-list/category-list.component";

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
     CommonModule
    ,MatButtonModule
    ,MatDialogActions
    ,MatDialogContent
    ,CategoryListComponent
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.css'
})
export class CategoryDialogComponent {
  constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>) { }

  onCategorySelected(category: ICategory): void {
    this.dialogRef.close(category)
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
