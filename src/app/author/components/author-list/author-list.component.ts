import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
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
import { ConfirmDialogComponent } from '../../../utils/dialogs/confirm-dialog/confirm-dialog.component';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';

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
export class AuthorListComponent implements OnInit, OnDestroy {
  @Input() isDialog: boolean = false;
  @Output() authorSelected = new EventEmitter<IAuthor>();
  
  authorTableColumns: string[] = ['name', 'dateOfBirth', 'createdDate', 'modifiedDate', 'details'];
  authorTableDataSource: IAuthor[] = [];

  authorFieldFilter = new FormControl('');
  isDeletedFieldFilter = new FormControl(false);

  offsetFieldFilter = 0;
  limitFieldFilter = 10;
  authorTableTotalRecords = 0;

  private authorSubject$ = new Subject<void>();
  private authorBehaviorSubject$ = new BehaviorSubject<IFilterGetAuthor>({
    offset: this.offsetFieldFilter,
    limit: this.limitFieldFilter,
  });

  constructor( private router: Router
              ,private dialog: MatDialog
              ,private authorService: AuthorService
              ,private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.authorBehaviorSubject$.pipe(
      switchMap(filter => this.authorService.getAuthors(filter)),
      takeUntil(this.authorSubject$)
    ).subscribe({
      next: (response: IDefaultResponse<IAuthors>)=> {
        this.authorTableDataSource = response.data.authors;
        this.authorTableTotalRecords = response.data.paging.totalRecords;
      },
      error: (errorResponse: HttpErrorResponse)=> {
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

  onClickSelectAuthor(author: IAuthor): void {
    this.authorSelected.emit(author);
  }

  onClickDeleteAuthor(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { message: 'Are you sure you want to delete this record?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.authorService.deleteAuthor(id).subscribe({
          next: (response: IDefaultResponse) => {
            if (!response.success)
              this.notificationService.showErrorMessage('Failed to delete author');
            else {
	            this.loadAuthors();
              this.notificationService.showSuccessMessage("The author was successfully deleted");
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            const response = errorResponse.error as IDefaultResponse;

            console.error('Error deleting book', response);
            this.notificationService.showErrorMessage('Failed to delete author');
          }
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.offsetFieldFilter = event.pageIndex * event.pageSize;
    this.limitFieldFilter = event.pageSize;
    this.loadAuthors();
  }

  ngOnDestroy(): void {
    this.authorSubject$.next();
    this.authorSubject$.complete();
  }

  loadAuthors(): void {
   this.authorBehaviorSubject$.next({
      author: this.authorFieldFilter.value || '',
      isDeleted: this.isDeletedFieldFilter.value,
      offset: this.offsetFieldFilter,
      limit: this.limitFieldFilter
    });
  }
}