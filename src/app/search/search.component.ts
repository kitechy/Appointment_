import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchTerm = '';

  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchTerm.trim().toLowerCase());
  }
}
