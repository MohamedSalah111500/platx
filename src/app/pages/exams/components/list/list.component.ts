import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Exam } from '../../types';
import { ExamService } from '../../services/exam.service';
import { convertDateToLocalDate } from 'src/app/utiltis/functions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})


export class ListComponent implements OnInit {

  convertDateToLocalDate = convertDateToLocalDate;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any
  contactsList: any
  
  // Table data
  total: Observable<number>;
  createContactForm!: UntypedFormGroup;
  submitted = false;
  contacts: any;
  files: File[] = [];
  endItem: any

  @ViewChild('newContactModal', { static: false }) newContactModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;


  loading: boolean = false;
  list: Exam[];
  filteredList: Exam[];

  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;


  constructor(private modalService: BsModalService, private formBuilder: UntypedFormBuilder, public examService: ExamService) {
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Exams' }, { label: 'Exams List', active: true }];
  
    this.getAllData(this.page, this.pageSize);

    this.createContactForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      position: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      profile: ['', [Validators.required]],
    })
  }


  getAllData(pageNumber: number, pageSize: number, search: string = "") {
    this.loading = true;
    this.examService.getAllExams(pageNumber, pageSize, search).subscribe(
      (response) => {
        this.list = response.items;
        this.filteredList = [...this.list];
        this.totalCount = response.totalCount;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#member-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.createContactForm.controls['profile'].setValue(this.imageURL);
    }
    reader.readAsDataURL(file)
  }

  // Save User
  saveUser() {
    if (this.createContactForm.valid) {
      if (this.createContactForm.get('id')?.value) {
        const updatedData = this.createContactForm.value;
      } else {
        this.createContactForm.controls['id'].setValue((this.contactsList.length + 1).toString());
        const newData = this.createContactForm.value;
      }
    }
    this.newContactModal?.hide()
    document.querySelectorAll('#member-img').forEach((element: any) => {
      element.src = 'assets/images/users/user-dummy-img.jpg';
    });

    setTimeout(() => {
      this.createContactForm.reset();
    }, 1000);
  }

  // fiter job
  searchJob() {
    if (this.term) {
      this.filteredList = this.list.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.filteredList = this.list
    }
  }

  // Edit User
  editUser(id: any) {
    this.submitted = false;
    this.newContactModal?.show()
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Profile';
    var updateBtn = document.getElementById('addContact-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.createContactForm.patchValue(this.contactsList[id]);
  }

  // pagechanged
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.contactsList = this.filteredList.slice(startItem, this.endItem);
  }

  // Delete User
  removeUser(id: any) {
    this.deleteId = id
    this.removeItemModal?.show();
  }

  confirmDelete(id: any) {
    this.removeItemModal?.hide();
  }

}
