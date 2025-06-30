import { Component, effect, signal } from '@angular/core';
import { ELEMENT_DATA, PeriodicElement } from './periodic-element';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ElementsStore } from './stores/elements.store';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  loading = signal(true);
  elements = signal<PeriodicElement[]>([]);
  
  constructor(public elementsStore: ElementsStore) {
    setTimeout(() => {
      this.elements.set(ELEMENT_DATA); 
      this.loading.set(false);
    }, 2000);
  }

  filterInput = signal('');
  filtering = signal(false);

  private debounceTimeout?: any;

  onFilterInputChange(value: string | null) {
    if (!value) return;
    this.filterInput.set(value);
    this.filtering.set(true);
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.elementsStore.setFilter(value);
      this.filtering.set(false);
    }, 2000);
  }
  onInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.onFilterInputChange(input.value);
  }
  // For editing popup
  editingElement: PeriodicElement | null = null;
  editingField: keyof PeriodicElement | null = null;

  openEditDialog(element: PeriodicElement, field: keyof PeriodicElement) {
    this.editingElement = { ...element }; // clone for editing
    this.editingField = field;
    
  }

  saveEdit() {
    if (this.editingElement) {
      this.elementsStore.updateElement(this.editingElement);
      this.editingElement = null;
      this.editingField = null;
    }
  }

  cancelEdit() {
    this.editingElement = null;
    this.editingField = null;
  }

  clearFilter() {
    this.filterInput.set(' ');
    this.elementsStore.setFilter(' ');
  }


  get editingValue(): string | number {
  if (!this.editingElement || !this.editingField) return '';
  return this.editingElement[this.editingField];
}

set editingValue(value: string | number) {
  if (this.editingElement && this.editingField) {
    if (this.editingField === 'weight' || this.editingField === 'position') {
      // For numeric fields convert to number
      this.editingElement[this.editingField] = Number(value) as any;
    } else {
      // For string fields, ensure it's string
      this.editingElement[this.editingField] = String(value) as any;
    }
  }
}




}
