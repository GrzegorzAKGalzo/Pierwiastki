import { Injectable, signal, computed } from '@angular/core';
import { ELEMENT_DATA } from '../periodic-element';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

@Injectable({ providedIn: 'root' })
export class ElementsStore {
  // Initial data signal
  private _elements = signal<PeriodicElement[]>(ELEMENT_DATA);

  // Filter string signal
  private _filter = signal('');

  // Computed filtered elements
  filteredElements = computed(() => {
    const filter = this._filter().toLowerCase().trim();
    if (!filter) return this._elements();

    return this._elements().filter(el =>
      Object.values(el).some(value =>
        String(value).toLowerCase().includes(filter)
      )
    );
  });

  // Expose elements for direct read if needed
  get elements() {
    return this._elements();
  }

  // Update filter string
  setFilter(value: string) {
    this._filter.set(value);
  }

  // Update an element by position
  updateElement(updated: PeriodicElement) {
    this._elements.update(elements => {
      const index = elements.findIndex(e => e.position === updated.position);
      if (index === -1) return elements;
      const newElements = [...elements];
      newElements[index] = updated;
      return newElements;
    });
  }
}
