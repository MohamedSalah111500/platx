import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GroupsService } from 'src/app/pages/groups/services/groupsService.service';
import { Student, Group } from 'src/app/pages/groups/types';
import { ManageService } from 'src/app/pages/manage/services/manageService.service';
import { FilemanagerService } from '../../services/filemanager.service';
import { FileItem } from '../../types';

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss']
})
export class FilemanagerComponent implements OnInit {
   // bread crumb items
   breadCrumbItems: Array<{}>;
   term: any;
   // Table data
   total: Observable<number>;
   files: File[] = [];
   endItem: any;
   editMode: boolean = false;
   editItem!: Student;
   @ViewChild("newContactModal", { static: false })
   newContactModal?: ModalDirective;
   @ViewChild("removeItemModal", { static: false })
   removeItemModal?: ModalDirective;
   deleteId: any;
   returnedArray: any;
   loading: boolean = false;
   list: FileItem[];
   totalCount: number = 0;
   page: number = 1;
   pageSize: number = 10;
   studentForm: FormGroup<any>;
   submitted = false;
   // lookups
   groups: Group[];
   radialoptions!:any;
  constructor(private fb: FormBuilder,
    public store: Store,
    public toastr: ToastrService,
    private filemanagerService: FilemanagerService,

  ) {}



  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Manage" },
      { label: "Students", active: true },
    ];

    this.studentForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      dateOfBirth: ["", Validators.required],
      enrollment: ["", Validators.required],
      address: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      emergencyContact: ["", Validators.required],
      grades: ["", Validators.required],
      groupId: ["", Validators.required],
      userId: [""],
      profileImage: [""],
      id: [null],
    });

    this.radialoptions = {
      series: [76],
      chart: {
        height: 150,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#556ee6'],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: '60%',
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '16px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      stroke: {
        dashArray: 3
      },
      labels: ['Storage'],
    }

    this.getAllData(this.page, this.pageSize);
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll("#member-img").forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.studentForm.controls.profileImage.setValue(this.imageURL);
    };
    reader.readAsDataURL(file);
  }

  getAllData(pageNumber: number, pageSize: number) {
    this.loading = true;
    this.filemanagerService.getAllFiles(pageNumber, pageSize).subscribe(
      (response) => {
        this.list = response.items;
        this.returnedArray = [...this.list];
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }


  // fiter job
  search() {
    if (this.term) {
      this.list = this.returnedArray.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase());
      });
    } else {
      this.list = this.returnedArray;
    }
  }

  pageChanged(event: PageChangedEvent): void {
    this.getAllData(event.page, event.itemsPerPage);
    this.page = event.page;
  }



  openDeleteModel(id: any) {
    this.deleteId = id;
    this.removeItemModal?.show();
  }

  // confirmDelete(id: any) {
  //   this.manageService.deleteStudent(id).subscribe(() => {
  //     this.toastr.success("deleted successfully", "Role");
  //     this.getAllData(this.page, this.pageSize);
  //   });
  //   this.removeItemModal?.hide();
  // }

  edit(item: Student) {
    this.editMode = true;
    this.submitted = false;
    this.editItem = item;
    this.studentForm.patchValue(item);
    this.newContactModal?.show();
  }

  // create(): void {
  //   this.submitted = true;
  //   if (this.studentForm.valid) {
  //     const payload = {
  //       firstName: this.studentForm.value.firstName,
  //       lastName: this.studentForm.value.lastName,
  //       email: this.studentForm.value.email,
  //       dateOfBirth: this.studentForm.value.dateOfBirth,
  //       enrollment: this.studentForm.value.enrollment,
  //       address: this.studentForm.value.address,
  //       phoneNumber: this.studentForm.value.phoneNumber,
  //       emergencyContact: this.studentForm.value.emergencyContact,
  //       grades: this.studentForm.value.grades,
  //       userId: null,
  //       groupId: this.studentForm.value.groupId,
  //       profileImage: this.studentForm.controls.profileImage?.value,
  //     };

  //     if (this.editMode) {
  //       payload["id"] = this.studentForm.value.id;

  //       this.manageService
  //         .updateStudent(this.editItem.id, payload)
  //         .subscribe((response) => {
  //           this.toastr.success("Student updated successfully", "Successfully");
  //           this.studentForm.reset();
  //           this.newContactModal?.hide();
  //           this.getAllData(this.page, this.pageSize);
  //         });
  //     } else {
  //       this.manageService.createStudent(payload).subscribe((response) => {
  //         this.toastr.success("Student created successfully", "Successfully");
  //         this.studentForm.reset();
  //         this.newContactModal?.hide();
  //         this.getAllData(this.page, this.pageSize);
  //       });
  //     }
  //   }
  // }
}
