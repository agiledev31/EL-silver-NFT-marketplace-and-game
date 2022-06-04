import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast } from 'src/app/_constants/SwalToast';
import { LevelService } from 'src/app/core/services/level.service';
import { UserLevel } from 'src/app/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  form: FormGroup;
  isSubmit = false;
  isLoader = false;
  isUpdate: boolean = false;
  updateIndex: number = null;

  levels: UserLevel[] = null;

  constructor(private router: Router, private formBuilder: FormBuilder, private levelService: LevelService,) { }

  ngOnInit(): void {
    this.create();
    this.getAllLevels();
  }

  create() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      minPoints: ['', Validators.required],
      commissionRate: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    (this.isUpdate) ? this.update() : this.add();
  }


  // gets all levels
  getAllLevels() {
    this.isLoader = true;
    this.levelService.getAll().subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        this.levels = res.data.docs;
      }
    }, err => {
      this.levels = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }

  // adds a new level
  add() {
    this.levelService.create({ level: this.form.value }).subscribe((res: any) => {
      if (res.status === 200) {
        this.cancel();
        this.getAllLevels();
        Toast.fire({ icon: 'success', title: 'User Level Added' });
      }
    }, err => {
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }


  // updates Level
  update() {
    this.isLoader = true;
    const id = this.levels[this.updateIndex]._id;
    this.levelService.update(id, this.form.value).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        this.cancel();
        this.getAllLevels();
        Toast.fire({ icon: 'success', title: 'User Level Updated' });
      }
    }, err => {
      this.levels = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }

  // resets all fields and variables
  cancel() {
    this.updateIndex = null;
    this.isUpdate = false;
    this.isSubmit = false;
    this.form.reset();
  }

  // on edit level
  editLevel(i) {
    this.cancel();
    this.isUpdate = true;
    this.updateIndex = i;
    this.form.patchValue(this.levels[i]);
  }

  // deletes Permanently
  deleteDB(id) {
    this.levelService.delete(id).subscribe((res: any) => {
      if (res.status === 200) {
        this.cancel();
        this.levels = this.levels.filter(l => l._id === id);
        // this.getAllLevels();
        Toast.fire({ icon: 'warning', title: 'Level Deleted' });
      }
    }, err => {
      this.levels = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })

  }


  // Swal Confirmation
  deleteLevel(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteDB(id);
        // Swal.fire(
        //   'Deleted!',
        //   'Level has been deleted.',
        //   'success'
        // )
      }
    })
  }

}
