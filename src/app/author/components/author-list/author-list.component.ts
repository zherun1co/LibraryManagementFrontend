import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IAuthor } from '../../interfaces/IAuthor';
import { IAuthors } from '../../interfaces/IAuthors';
import { AuthorService } from '../../services/author.service';
import { IFilterGetAuthor } from '../../interfaces/IFilterGetAuthor';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';

@Component({
  selector: 'app-author-list',
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
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css'
})
export class AuthorListComponent implements OnInit {
  @Input() isDialog: boolean = false;
  @Output() authorSelected = new EventEmitter<IAuthor>();
  
  authorTableColumns: string[] = ['name', 'dateOfBirth', 'createdDate', 'modifiedDate', 'details'];
  authorTableDataSource: IAuthor[] = [];

  authorFilter = new FormControl('');
  isDeletedFilter = new FormControl(false);

  offset = 0;
  limit = 10;
  totalRecords = 0;

  constructor( private router: Router
              ,private authorService: AuthorService
              ,private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    const filter: IFilterGetAuthor = {
      author: this.authorFilter.value || '',
      isDeleted: this.isDeletedFilter.value,
      offset: this.offset,
      limit: this.limit
    };

    this.authorService.getAuthors(filter).subscribe({
      next: (response: IDefaultResponse<IAuthors>) => {
        this.authorTableDataSource = response.data.authors;
        this.totalRecords = response.data.paging.totalRecords;
      },
      error: (errorResponse: HttpErrorResponse) => {
        const response = errorResponse.error as IDefaultResponse;

        console.error('Error fetching authors', response);
        this.notificationService.showErrorMessage('Failed to fetching authors.');
      }
    });
  }

  onClickSearch(): void {
    this.loadAuthors();
  }

  onClickNewAuthor(): void {
    this.router.navigate(['/authors/new']);
  }

  onClickUpdateAuthor(id: string): void {
    this.router.navigate([`/authors/edit/${id}`]);
  }

  onClickSelectAuthor (author: IAuthor): void {
    this.authorSelected.emit(author);
  }

  onPageChange(event: any): void {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.loadAuthors();
  }
}