import { Component, Input } from '@angular/core';

@Component({
  selector: 'platx-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {

  @Input() type: string = '';

  message: string = '';
  imagePath: string = '';

  // Define the mappings for type to message and image
  private typeMappings: { [key: string]: { message: string, imagePath: string } } = {
    emptyRecords: {
      message: 'No records found.',
      imagePath: 'assets/images/empty-records.svg'
    },
    noResults: {
      message: 'No results match your search.',
      imagePath: 'assets/images/no-results.png'
    },
    // Add more mappings as needed
  };

  ngOnInit() {
    this.updateEmptyState();
  }

  ngOnChanges() {
    this.updateEmptyState();
  }

  private updateEmptyState() {
    const mapping = this.typeMappings[this.type];
    if (mapping) {
      this.message = mapping.message;
      this.imagePath = mapping.imagePath;
    } else {
      // Default case if type is not found
      this.message = 'No data available.';
      this.imagePath = 'assets/images/default-empty.png';
    }
  }
}
