import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IBook } from '../../interfaces/IBook';
import { IBooks } from '../../interfaces/IBooks';
import { BookService } from '../../services/book.service';
import { IFilterGetBook } from '../../interfaces/IFilterGetBook';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
      CommonModule
     ,MatIconModule
     ,MatChipsModule
     ,MatTableModule
     ,MatInputModule
     ,MatButtonModule
     ,MatTooltipModule
     ,MatCheckboxModule
     ,MatFormFieldModule
     ,MatPaginatorModule
     ,ReactiveFormsModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit, OnDestroy {
  bookTableColumns: string[] = ['title', 'authorName', 'publishedDate', 'genere', 'categories', 'createdDate', 'modifiedDate', 'details'];
  bookTableDataSource: IBook[] = [];

  authorFieldFilter = new FormControl('');
  titleFieldFilter = new FormControl('');
  categoryFieldFilter = new FormControl('');
  isDeletedFieldFilter = new FormControl(false);

  offsetFieldFilter = 0;
  limitFieldFilter = 10;
  bookTableTotalRecords = 0;

  private bookSubject$ = new Subject<void>();
  private bookBehaviorSubject$ = new BehaviorSubject<IFilterGetBook>({
    offset: this.offsetFieldFilter,
    limit: this.limitFieldFilter
  });

  constructor( private router: Router
              ,private bookService: BookService
              ,private dialog: MatDialog
              ,private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.bookBehaviorSubject$.pipe(
      switchMap(filter => this.bookService.getBooks(filter)),
      takeUntil(this.bookSubject$)
    ).subscribe({
      next: (response: IDefaultResponse<IBooks>)=> {
        this.bookTableDataSource = response.data.books;
        this.bookTableTotalRecords = response.data.paging.totalRecords;
      },
      error: (errorResponse: HttpErrorResponse)=> {
        const response = errorResponse.error as IDefaultResponse;
        
        console.error('Error fetching books', response);
        this.notificationService.showErrorMessage('Failed to fetch books.');
      }
    });
  }

  onClickSearch(): void {
    this.loadBooks();
  }

  onClickNewBook(): void {
    this.router.navigate(['/books/new']);
  }

  onClickUpdateBook(id: string): void {
    this.router.navigate([`/books/edit/${id}`]);
  }

  onClickDeleteBook(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { message: 'Are you sure you want to delete this record?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookService.deleteBook(id).subscribe({
          next: (response: IDefaultResponse) => {
            if (!response.success)
              this.notificationService.showErrorMessage('Failed to delete book');
            else {
              this.loadBooks();
              this.notificationService.showSuccessMessage("The book was successfully deleted");
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            const response = errorResponse.error as IDefaultResponse;

            console.error('Error deleting book', response);
            this.notificationService.showErrorMessage('Failed to delete category');
          }
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.offsetFieldFilter = event.pageIndex * event.pageSize;
    this.limitFieldFilter = event.pageSize;

    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.bookSubject$.next();
    this.bookSubject$.complete();
  }

  loadBooks(): void {
    this.bookBehaviorSubject$.next({
      author: this.authorFieldFilter.value || '',
      title: this.titleFieldFilter.value || '',
      category: this.categoryFieldFilter.value || '',
      isDeleted: this.isDeletedFieldFilter.value,
      offset: this.offsetFieldFilter,
      limit: this.limitFieldFilter
    });
  }
}