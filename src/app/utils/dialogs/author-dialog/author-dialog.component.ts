import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';

import { IAuthor } from '../../../author/interfaces/IAuthor';
import { AuthorListComponent } from '../../../author/components/author-list/author-list.component';

@Component({
  selector: 'app-author-dialog',
  standalone: true,
  imports: [
     CommonModule
    ,MatButtonModule
    ,MatDialogActions
    ,MatDialogContent
    ,AuthorListComponent
],
  templateUrl: './author-dialog.component.html',
  styleUrl: './author-dialog.component.css'
})
export class AuthorDialogComponent {
  constructor(public dialogRef: MatDialogRef<AuthorDialogComponent>) { }

  onAuthorSelected(author: IAuthor): void {
    this.dialogRef.close(author)
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
