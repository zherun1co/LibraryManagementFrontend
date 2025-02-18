import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ICategory } from '../../interfaces/ICategory';
import { DateUtils } from '../../../utils/utils/date-utils';
import { ICategoryBook } from '../../interfaces/ICategoryBook';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [
     MatIconModule
    ,MatChipsModule
    ,MatInputModule
    ,MatButtonModule
    ,MatTooltipModule
    ,MatCheckboxModule
    ,MatFormFieldModule
    ,ReactiveFormsModule
  ],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = signal(false);
  categoryId: string | null = null;
  booksCategory: ICategoryBook[] = [];
  
  constructor( private fb: FormBuilder
              ,private router: Router
              ,private route: ActivatedRoute
              ,private categoryService: CategoryService
              ,private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      createdDate: [{ value: '', disabled: true }],
      modifiedDate: [{ value: '', disabled: true }],
      isDeleted: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
        if (this.categoryId) {
          this.isEditMode.set(true);
          this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: string): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (response: IDefaultResponse<ICategory>) => {
        this.categoryForm.patchValue({
          name: response.data.name,
          createdDate: response.data.createdDate
            ? DateUtils.formatDate(response.data.createdDate, 'YYYY-MM-DD')
            : '',
          modifiedDate: response.data.modifiedDate
            ? DateUtils.formatDate(response.data.modifiedDate, 'YYYY-MM-DD')
            : '',
          isDeleted: response.data.isDeleted ?? false
        });

        if (response.data.books)
          this.booksCategory = response.data.books;
      },
      error: (errorResponse: HttpErrorResponse) => {
        const response = errorResponse.error as IDefaultResponse;
        
        console.error('Error loading category:', response);
        this.notificationService.showErrorMessage('Failed to load category');
      }
    });
  }

  onClickBook(book: ICategoryBook): void {
    alert(`Book Selected: ${book.title}`);
  }

  saveCategory(): void {
    if(this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const categoryData: ICategory = this.categoryForm.value;

    if (this.isEditMode()) {
      categoryData.id = this.categoryId;

      this.categoryService.updateCategory(categoryData).subscribe({
        next: (response: IDefaultResponse<ICategory>) => {
          this.notificationService.showSuccessMessage('Category updated successfully');

          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 2000);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error updating category:', response);
          this.notificationService.showErrorMessage(response.message);
        }
      });
    } else {
      this.categoryService.addCategory(categoryData).subscribe({
        next: (response: IDefaultResponse<ICategory>) => {
          this.notificationService.showSuccessMessage('Category created successfully.');

          setTimeout(() => {
            this.router.navigate(['/categories']);
          }, 2000);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error creating category:', response);
          this.notificationService.showErrorMessage(response.message);
        }
      });
    }
  }

  onClickCancel(): void {
    this.router.navigate(['/categories']);
  }
}