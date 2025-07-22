import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-open-account-modal',
  templateUrl: './open-account-modal.component.html',
  styleUrl: './open-account-modal.component.scss'
})
export class OpenAccountModalComponent {
  aceito: boolean = false;
  
  constructor(public dialogRef: MatDialogRef<OpenAccountModalComponent>) {}
  
  close(): void {
    this.dialogRef.close();
  }
}
