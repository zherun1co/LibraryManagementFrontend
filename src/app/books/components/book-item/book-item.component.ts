import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, startWith, of } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { IBook } from '../../interfaces/IBook';
import { BookService } from '../../services/book.service';
import { DateUtils } from '../../../utils/utils/date-utils';
import { IAuthor } from '../../../author/interfaces/IAuthor';
import { ICategory } from '../../../category/interfaces/ICategory';
import { AuthorService } from '../../../author/services/author.service';
import { CategoryService } from '../../../category/services/category.service';
import { NotificationService } from '../../../utils/services/notificationService';
import { IDefaultResponse } from '../../../utils/interfaces/defaults/IDefaultResonse';
import { IAuthorBookCategory } from '../../../author/interfaces/IAuthorBookCategory';
import { AuthorDialogComponent } from '../../../utils/dialogs/author-dialog/author-dialog.component';
import { CategoryDialogComponent } from '../../../utils/dialogs/category-dialog/category-dialog.component';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [
      CommonModule
     ,MatIconModule
     ,MatChipsModule
     ,MatInputModule
     ,MatButtonModule
     ,MatDialogModule
     ,MatTooltipModule
     ,MatCheckboxModule
     ,MatFormFieldModule
     ,MatAutocompleteModule
     ,ReactiveFormsModule
  ],
  templateUrl: './book-item.component.html',
  styleUrl: './book-item.component.css'
})
export class BookItemComponent implements OnInit {
  @Input() authorId: string | null = null;
  @Output() bookAdded = new EventEmitter<IBook>

  bookForm: FormGroup;
  isEditMode = signal(false);
  bookId: string | null = null;

  categories$: Observable<ICategory[]>;
  authors$: Observable<IAuthor[]>;

  datePattern = '^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$';
  @ViewChild('datePicker') datePicker!: ElementRef<HTMLInputElement>;

  categoryInput = this.fb.control('');
  authorInput = this.fb.control('');

  constructor( private fb: FormBuilder
              ,private router: Router
              ,private dialog: MatDialog
              ,private route: ActivatedRoute
              ,private bookService: BookService
              ,private authorService: AuthorService
              ,private categoryService: CategoryService
              ,private notificationService: NotificationService
  ) {
      this.bookForm = this.fb.group({
        authorId: ['', [Validators.required]],
        title: ['', [Validators.required, Validators.minLength(3)]],
        publishedDate: [''],
        genere: [''],
        categories: [[]],
        createdDate: [{ value: '', disabled: true }],
        modifiedDate: [{ value: '', disabled: true }],
        isDeleted: [false]
      });

      this.categories$ = this.categoryInput.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => (value?.length ?? 0) >= 3 ? this.loadCategories(value!) : of([]))
      );

      this.authors$ = this.authorInput.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => (value?.length ?? 0) >= 3 ? this.loadAuthors(value!) : of([]))
      );
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');

      if (this.bookId) {
        this.isEditMode.set(true);
        this.loadBook(this.bookId);
      }
    });

    this.bookForm.controls['authorId'].setValue(this.authorId);
  }

  loadBook(id: string): void {
    this.bookService.getBookById(id).subscribe({
      next: (response: IDefaultResponse<IBook>) => {
        this.bookForm.patchValue({
          authorId: response.data.authorId,
          title: response.data.title,
          publishedDate: response.data.publishedDate
            ? DateUtils.formatDate(response.data.publishedDate, 'YYYY-MM-DD')
            : '',
          genere: response.data.genere,
          categories: response.data.categories || [],
          createdDate: response.data.createdDate
            ? DateUtils.formatDate(response.data.createdDate, 'YYYY-MM-DD')
            : '',
          modifiedDate: response.data.modifiedDate
          ? DateUtils.formatDate(response.data.modifiedDate, 'YYYY-MM-DD')
          : '',
          isDeleted: response.data.isDeleted ?? false
        });

        this.authorInput.setValue(response.data.authorName);
      },
      error: (errorResponse: HttpErrorResponse) => {
        const response = errorResponse.error as IDefaultResponse;

        console.error('Error loading book:', response);
        this.notificationService.showErrorMessage('Failed to load book');
      }
    });
  }

  validateDateInput(event: any): void {
    const value = event.target.value;
    const regex = new RegExp(this.datePattern);

    if (value && !regex.test(value))
      this.bookForm.controls['publishedDate'].setErrors({ incorrectFormat: true });
    else
      this.bookForm.controls['publishedDate'].setErrors(null);
  }

  openDatePicker(datePicker: HTMLInputElement): void {
    if (this.bookForm.controls['publishedDate'].value)
      datePicker.value = this.bookForm.controls['publishedDate'].value;

    this.datePicker.nativeElement.showPicker();
  }

  onDateChange(event: any): void {
    this.bookForm.controls['publishedDate'].setValue(event.target.value);
  }

  loadCategories(filter: string): Observable<ICategory[]> {
    return this.categoryService.getCategories({ category: filter, limit: 10 }).pipe(
      map(response => response.data)
    );
  }

  addCategory(category: ICategory): void {
    const currentCategories = this.bookForm.controls['categories'].value;

    if (currentCategories.some((c: ICategory) => c.id === category.id)) {
      this.notificationService.showErrorMessage(`Category "${category.name}" is already added.`);
      this.categoryInput.setValue('');
      return;
    }

    if (!currentCategories.find((c: ICategory) => c.id === category.id))
      this.bookForm.controls['categories'].setValue([...currentCategories, category]);

    if (this.isEditMode()) {
      this.bookService.addCategoryBook(this.bookId!, { id: category.id }).subscribe({
        next: (response: IDefaultResponse<IAuthorBookCategory>) => {
          this.notificationService.showSuccessMessage(`Category "${response.data.name}" added successfully`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error adding category:', response);
          this.notificationService.showErrorMessage(`Failed to add category "${category.name}"`);
        }
      });
    }

    this.categoryInput.setValue('');
  }

  removeCategory(category: ICategory): void {
    const currentCategories = this.bookForm.controls['categories'].value.filter((c: ICategory) => c.id !== category.id);
    this.bookForm.controls['categories'].setValue(currentCategories);

    if (this.isEditMode()) {
      this.bookService.deleteCategoryBook(this.bookId!, category.id ?? '').subscribe({
        next: (response: IDefaultResponse) => {
          this.notificationService.showSuccessMessage(`Category "${category.name}" removed successfully`);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error removing category:', response);
          this.notificationService.showErrorMessage(`Failed to remove category "${category.name}"`);
        }
      });
    }
  }

  loadAuthors(filter: string): Observable<IAuthor[]> {
    return this.authorService.getAuthors({ author: filter, isDeleted: false, offset: 0, limit: 10 }).pipe(
      map(response => response.data.authors)
    );
  }

  validateAuthorSelection(): void {
    if (!this.bookForm.controls['authorId'].value) {
      this.bookForm.controls['authorId'].setErrors({ required: true });
      this.bookForm.controls['authorId'].markAsTouched();
    }
  }

  selectAuthor(author: IAuthor): void {
    this.bookForm.controls['authorId'].setValue(author.id);
    this.authorInput.setValue(author.name);
  }

  saveBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const bookData: IBook = this.bookForm.value;

    if (this.isEditMode()) {
      bookData.id = this.bookId;
      delete bookData.categories;

      this.bookService.updateBook(bookData).subscribe({
        next: (response: IDefaultResponse<IBook>) => {
          this.notificationService.showSuccessMessage('Book updated successfully');

          setTimeout(() => this.router.navigate(['/books']), 2000);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error updating book:', response);
          this.notificationService.showErrorMessage(response.message);
        }
      });
    } else {
      this.bookService.addBook(bookData).subscribe({
        next: (response: IDefaultResponse<IBook>) => {
          this.notificationService.showSuccessMessage('Book created successfully');

          if (this.authorId)
            this.bookAdded.emit(response.data);
          else
            setTimeout(() => this.router.navigate(['/books']), 2000);
        },
        error: (errorResponse: HttpErrorResponse) => {
          const response = errorResponse.error as IDefaultResponse;

          console.error('Error creating book:', response);
          this.notificationService.showErrorMessage(response.message);
        }
      });
    }
  }

  onClickCancel(): void {
    if (!this.authorId) {
      this.router.navigate(['/books']);
    }
  }
  
  openAuthorListModal(): void {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((author: IAuthor | undefined) => {
      if (author) {
        this.bookForm.controls['authorId'].setValue(author.id);
        this.authorInput.setValue(author.name);
      }
    });
  }

  openCategoryListModal(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((category: ICategory | undefined) => {
      if (category)
        this.addCategory(category);
    });
  }
}