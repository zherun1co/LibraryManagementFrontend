import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';

import { IBook } from '../../interfaces/IBook';
import { IBooks } from '../../interfaces/IBooks';
import { BookService } from '../../services/book.service';
import { IFilterGetBook } from '../../interfaces/IFilterGetBook';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';

@Component({
  selector: 'app-book-list',
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
     ,MatChipsModule
     ,ReactiveFormsModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  bookTableColumns: string[] = ['title', 'authorName', 'publishedDate', 'genere', 'categories', 'createdDate', 'modifiedDate', 'details'];
  bookTableDataSource: IBook[] = [];

  authorFilter = new FormControl('');
  titleFilter = new FormControl('');
  categoryFilter = new FormControl('');
  isDeletedFilter = new FormControl(false);

  offset = 0;
  limit = 10;
  totalRecords = 0;

  constructor( private router: Router
              ,private bookService: BookService
              ,private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const filter: IFilterGetBook = {
      author: this.authorFilter.value || '',
      title: this.titleFilter.value || '',
      category: this.categoryFilter.value || '',
      isDeleted: this.isDeletedFilter.value,
      offset: this.offset,
      limit: this.limit
    };

    this.bookService.getBooks(filter).subscribe({
      next: (response: IDefaultResponse<IBooks>) => {
        this.bookTableDataSource = response.data.books;
        this.totalRecords = response.data.paging.totalRecords;
      },
      error: (errorResponse: HttpErrorResponse) => {
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

  onPageChange(event: any): void {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.loadBooks();
  }
}