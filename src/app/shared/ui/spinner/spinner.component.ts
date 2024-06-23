// spinner.component.ts

import { Component } from "@angular/core";

@Component({
  selector: "app-spinner",
  template: `<div *ngIf="isVisible" class="backdrop">
    <div class="spinner"></div>
  </div>`,
  styleUrls: ["./spinner.component.css"],
})
export class SpinnerComponent {
  public isVisible = false;

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}
