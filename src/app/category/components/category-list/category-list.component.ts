import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ICategory } from '../../interfaces/ICategory';
import { CategoryService } from '../../services/category.service';
import { IFilterGetCategory } from '../../interfaces/IFilterGetCategory';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
     CommonModule
    ,MatIconModule
    ,MatTableModule
    ,MatInputModule
    ,MatButtonModule
    ,MatTooltipModule
    ,MatCheckboxModule
    ,MatFormFieldModule
    ,MatPaginatorModule
    ,ReactiveFormsModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  @Input() isDialog: boolean = false;
  @Output() categorySelected = new EventEmitter<ICategory>

  categoryTableColumns: string[] = ['name', 'createdDate', 'modifiedDate', 'details'];
  categoryTableDataSource: ICategory[] = [];

  categoryFilter = new FormControl('');
  isDeletedFilter = new FormControl(false);

  constructor( private router: Router
              ,private categoryService: CategoryService
              ,private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(limit: number | null = null): void {
    const filter: IFilterGetCategory = {
      category: this.categoryFilter.value || '',
      isDeleted: this.isDeletedFilter.value,
      limit
    };

    this.categoryService.getCategories(filter).subscribe({
      next: (response: IDefaultResponse<ICategory[]>) => {
        this.categoryTableDataSource = response.data;
      },
      error: (errorResponse: HttpErrorResponse) => {
        const response = errorResponse.error as IDefaultResponse;

        console.error('Error fetching categories', response);
        this.notificationService.showErrorMessage('Failed to fetching categories');
      }
    });
  }

  onClickSearch(): void {
    this.loadCategories();
  }

  onClickNewCategory(): void {
    this.router.navigate(['/categories/new']);
  }

  onClickUpdateCategory(id: string): void {
    this.router.navigate([`/categories/edit/${id}`]);
  }

  onClickSelectCategory (category: ICategory): void {
    this.categorySelected.emit(category);
  }
}