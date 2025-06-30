import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
    template: `
    <h1 mat-dialog-title>Edit Value</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <input matInput [(ngModel)]="data.value" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-button color="primary" (click)="dialogRef.close(data.value)">Save</button>
    </div>
  `,
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent {
 constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { value: any }
  ) {}
}
