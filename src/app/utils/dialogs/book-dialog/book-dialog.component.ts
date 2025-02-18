import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

import { IBook } from '../../../books/interfaces/IBook';
import { BookItemComponent } from "../../../books/components/book-item/book-item.component";

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
     CommonModule
    ,MatButtonModule
    ,MatDialogActions
    ,MatDialogContent
    ,BookItemComponent
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.css'
})
export class BookDialogComponent {
  @Input() authorId: string | null = null;

  constructor( public dialogRef: MatDialogRef<BookDialogComponent>
              ,@Inject(MAT_DIALOG_DATA) public data: { authorId: string | null }
  ) {
    if (data) {
      this.authorId = data.authorId;
    }
  }

  onBookAdded(book: IBook): void {
    this.dialogRef.close(book)
  }

  onClose(): void {
    this.dialogRef.close();
  }
}