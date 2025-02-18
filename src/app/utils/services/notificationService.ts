import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    constructor(private snackBar: MatSnackBar) {}

    showSuccessMessage(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['mat-toolbar', 'mat-accent']
        });
    }

    showErrorMessage(message: string): void {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['mat-toolbar', 'mat-warn']
        });
    }
}