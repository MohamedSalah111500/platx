import { Component, Input } from "@angular/core";
import { Group } from "../../types";

@Component({
  selector: "platx-group-block",
  templateUrl: "./group-block.component.html",
  styleUrls: ["./group-block.component.scss"],
})
export class GroupBlockComponent {
  @Input() group!: Group;
}
