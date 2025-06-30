import { Component } from '@angular/core';
import { ELEMENT_DATA, PeriodicElement } from './periodic-element';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'Pierwiastki';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  filterControl = new FormControl('');
  loading = true;
  filtering = false;


  
  constructor(private dialog: MatDialog){
     this.filterControl.valueChanges.pipe(
      debounceTime(2000)
    ).subscribe(value => {
      this.applyFilter(value!);
      this.filtering = false;
    });
    this.filterControl.valueChanges.subscribe(() => {
      this.filtering = true;
    });


    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const dataStr = Object.values(data).join(' ').toLowerCase();
      return dataStr.includes(filter.trim().toLowerCase());
    };
  }

  ngOnInit(): void {
      // Symulacja pobierania danych
      setTimeout(() => {
        this.dataSource.data = ELEMENT_DATA;
        this.loading = false;

      }, 1000);
    }


    openEditDialog<K extends keyof PeriodicElement>(element: PeriodicElement, column: K): void {
      const dialogRef = this.dialog.open(EditDialogComponent, {
        data: { value: element[column] }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          element[column] = result as PeriodicElement[K]; // 👈 tu rzutowanie
          this.dataSource = this.dataSource;
        }
      });
    }

   applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue;
   }
   clearFilter() {
    this.filterControl.setValue('');
    this.dataSource.filter = '';
  }

}
