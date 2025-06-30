import { Component } from '@angular/core';
import { ELEMENT_DATA, PeriodicElement } from './periodic-element';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'Pierwiastki';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: PeriodicElement[] = [];

  constructor(private dialog: MatDialog){}

  ngOnInit(): void {
      // Symulacja pobierania danych
      setTimeout(() => {
        this.dataSource = [...ELEMENT_DATA];
      }, 1000);
    }


    openEditDialog<K extends keyof PeriodicElement>(element: PeriodicElement, column: K): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { value: element[column] }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        element[column] = result as PeriodicElement[K]; // 👈 tu rzutowanie
        this.dataSource = [...this.dataSource];
      }
    });
  }
}
