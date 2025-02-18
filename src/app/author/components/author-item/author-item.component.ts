import { combineLatestWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { IAuthor } from '../../interfaces/IAuthor';
import { IBook } from '../../../books/interfaces/IBook';
import { IAuthorBook } from '../../interfaces/IAuthorBook';
import { DateUtils } from '../../../utils/utils/date-utils';
import { AuthorService } from '../../services/author.service';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';
import { BookDialogComponent } from '../../../utils/dialogs/book-dialog/book-dialog.component';

@Component({
  selector: 'app-author-item',
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
    ,ReactiveFormsModule
  ],
  providers: [],
  templateUrl: './author-item.component.html',
  styleUrl: './author-item.component.css'
})
export class AuthorItemComponent implements OnInit {
  @Input() isModal: boolean = false;
  
  authorForm: FormGroup;
  isEditMode = signal(false);
  authorId: string | null = null;

  authorBooksTableColumns: string[] = ['title', 'publishedDate', 'genere', 'categories', 'createdDate'];
  authorBooksTableDataSource: IAuthorBook[] = [];

  datePattern = '^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$';
  @ViewChild('datePicker') datePicker!: ElementRef<HTMLInputElement>;

  constructor( private fb: FormBuilder
              ,private router: Router
              ,private dialog: MatDialog
              ,private route: ActivatedRoute
              ,private authorService: AuthorService
              ,private notificationService: NotificationService
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      dateOfBirth: ['', [Validators.pattern(this.datePattern)]],
      createdDate: [{ value: '', disabled: true }],
      modifiedDate: [{ value: '', disabled: true }],
      isDeleted: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.authorId = params.get('id');

      if (this.authorId) {
        this.isEditMode.set(true);
        this.loadAuthorAndBooks(this.authorId);
      }
    });
  }

  loadAuthorAndBooks(id: string): void {
    this.authorService.getAuthorById(id)
      .pipe(combineLatestWith(this.authorService.getAuthorBooksByAuthorId(id))).subscribe({
        next: ([authorResponse, booksResponse]) => {
          this.authorForm.patchValue({
            name: authorResponse.data.name,
            dateOfBirth: authorResponse.data.dateOfBirth
              ? DateUtils.formatDate(authorResponse.data.dateOfBirth, 'YYYY-MM-DD')
              : '',
            createdDate: authorResponse.data.createdDate
              ? DateUtils.formatDate(authorResponse.data.createdDate, 'YYYY-MM-DD')
              : '',
            modifiedDate: authorResponse.data.modifiedDate
              ? DateUtils.formatDate(authorResponse.data.modifiedDate, 'YYYY-MM-DD')
              : '',
            isDeleted: authorResponse.data.isDeleted ?? false
          });

          this.authorBooksTableDataSource = booksResponse.data;
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error loading author and books:', response);
          this.notificationService.showErrorMessage('Failed to load author and books');
        }
      });
  }

  validateDateInput(event: any): void {
    const value = event.target.value;
    const regex = new RegExp(this.datePattern);

    if (value && !regex.test(value))
      this.authorForm.controls['dateOfBirth'].setErrors({ incorrectFormat: true });
    else
      this.authorForm.controls['dateOfBirth'].setErrors(null);
  }

  openDatePicker(datePicker: HTMLInputElement): void {
    if (this.authorForm.controls['dateOfBirth'].value)
      datePicker.value = this.authorForm.controls['dateOfBirth'].value;

    this.datePicker.nativeElement.showPicker();
  }

  onDateChange(event: any): void {
    this.authorForm.controls['dateOfBirth'].setValue(event.target.value);
  }

  saveAuthor(): void {
    if(this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      return;
    }

    const authorData: IAuthor = this.authorForm.value;

    if (this.isEditMode()) {
      authorData.id = this.authorId;

      this.authorService.updateAuthor(authorData).subscribe({
        next: (response: IDefaultResponse<IAuthor>) => {
            this.notificationService.showSuccessMessage('Author updated successfully');
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error updating author:', response);
          this.notificationService.showErrorMessage(response.message);
        }
      });
    } else {
      this.authorService.addAuthor(authorData).subscribe({
        next: (response: IDefaultResponse<IAuthor>) => {
            this.notificationService.showSuccessMessage('Author created successfully.');
            this.router.navigate([`/authors/edit/${response.data.id}`]);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error creating author:', response);
          this.notificationService.showErrorMessage(response.message);
        }
      });
    }
  }

  onClickCancel(): void {
    this.router.navigate(['/authors']);
  }

  onClickNewBook(): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      disableClose: false,
      autoFocus: true,
      data: { authorId: this.authorId }
    });

    dialogRef.afterClosed().subscribe((book: IBook | undefined) => {
      if (book) {
        const newAuthorBook: IAuthorBook = {
          id: book.id ?? undefined,
          title: book.title,
          publishedDate: book.publishedDate ?? undefined,
          genere: book.genere,
          categories: book.categories ?? [],
          createdDate: book.createdDate,
          modifiedDate: book.modifiedDate ?? undefined,
          isDeleted: book.isDeleted ?? false
        };

        this.authorBooksTableDataSource = [
          ...this.authorBooksTableDataSource, 
          newAuthorBook
        ].sort((a, b) => a.title.localeCompare(b.title));
      }
    });
  }
}