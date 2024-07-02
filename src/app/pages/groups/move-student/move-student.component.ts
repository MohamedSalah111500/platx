import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Group } from "../../groups/types";
import { Student } from '../types';

@Component({
  selector: 'platx-move-student',
  templateUrl: './move-student.component.html',
  styleUrls: ['./move-student.component.scss']
})
export class MoveStudentComponent implements OnInit {
  @Input() student: Student;
  @Input() groups!: Group[];
  @Input() currentGroupName: string;
  @Output() moveStudent = new EventEmitter<{ studentId: number, newGroupId: number }>();

  selectedGroupId: number | null = null;

  constructor() {}

  ngOnInit(): void {}


  onMoveStudent(confirmModal) {
    if (this.selectedGroupId !== null) {
      this.moveStudent.emit({ studentId: this.student.id, newGroupId: this.selectedGroupId });
      confirmModal.hide()
    }
  }
}
