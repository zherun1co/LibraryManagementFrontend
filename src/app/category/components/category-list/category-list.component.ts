import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
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
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit, OnDestroy {
  @Input() isDialog: boolean = false;
  @Output() categorySelected = new EventEmitter<ICategory>();

  categoryTableColumns: string[] = ['name', 'createdDate', 'modifiedDate', 'details'];
  categoryTableDataSource: ICategory[] = [];

  categoryNameFieldFilter = new FormControl('');
  categoryIsDeletedFieldFilter = new FormControl(false);

  private categoryFilterSubject$ = new Subject<void>();
  private categoryFilterBehaviorSubject$ = new BehaviorSubject<IFilterGetCategory>({ });

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.categoryFilterBehaviorSubject$.pipe(
        switchMap(filter => this.categoryService.getCategories(filter)),
        takeUntil(this.categoryFilterSubject$)
      ).subscribe({
        next: (response: IDefaultResponse<ICategory[]>) => {
          this.categoryTableDataSource = response.data;
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error fetching categories', response);
          this.notificationService.showErrorMessage('Failed to fetch categories');
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

  onClickDeleteCategory(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { message: 'Are you sure you want to delete this record?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: (response: IDefaultResponse) => {
            if (!response.success)
              this.notificationService.showErrorMessage('Failed to delete category');
            else {
              this.loadCategories();
              this.notificationService.showSuccessMessage("The category was successfully deleted");
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            const response = errorResponse.error as IDefaultResponse;

            console.error('Error deleting category', response);
            this.notificationService.showErrorMessage('Failed to delete category');
          }
        });
      }
    });
  }

  onClickSelectCategory(category: ICategory): void {
    this.categorySelected.emit(category);
  }

  ngOnDestroy(): void {
    this.categoryFilterSubject$.next();
    this.categoryFilterSubject$.complete();
  }

  loadCategories(): void {
    this.categoryFilterBehaviorSubject$.next({
      category: this.categoryNameFieldFilter.value || '',
      isDeleted: this.categoryIsDeletedFieldFilter.value,
      limit: this.categoryFilterBehaviorSubject$.value.limit
    });
  }
}