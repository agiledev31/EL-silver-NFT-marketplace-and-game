import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast } from 'src/app/_constants/SwalToast';
import { MiningChallengeService } from 'src/app/core/services/miningchallenge.service';
import { MiningChallenge } from 'src/app/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-mining-challenge',
  templateUrl: './mining-challenge.component.html',
  styleUrls: ['./mining-challenge.component.css']
})
export class MiningChallengeComponent implements OnInit {

  form: FormGroup;
  isSubmit = false;
  isLoader = false;
  isUpdate: boolean = false;
  updateIndex: number = null;

  miningchallenge: MiningChallenge[] = null;

  public items = [];

  public start='';
  public end='';
  public pool='';

  public addToList() {
    if (this.start == '' || this.end == '' || this.pool == '' ) {
    }
    else {
      this.items.push([this.start,this.end,this.pool]);
      let sum=0;
      for (var i in this.items) {
        sum += (this.items[i][1] - this.items[i][0] +1)*this.items[i][2];
      }
      this.form.patchValue({ poolprize: sum });
      this.start = '';
      this.end = '';
      this.pool = '';
    }
  }

  public deleteTask(index) {
    this.items.splice(index, 1);
    let sum = 0;
    for (var i in this.items) {
      sum += (this.items[i][1] - this.items[i][0] + 1) * this.items[i][2];
    }
    this.form.patchValue({ poolprize: sum });
  }


  constructor(private router: Router, private formBuilder: FormBuilder, private MiningChallengeService: MiningChallengeService,) { }

  ngOnInit(): void {
    this.create();
    this.getAllSeries();
  }

  create() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      poolprize: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }
    (this.isUpdate) ? this.update() : this.add();
  }

  // gets all miningchallenge
  getAllSeries() {
    this.isLoader = true;
    this.MiningChallengeService.getAll().subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        this.miningchallenge = res.data.docs;
      }
    }, err => {
      this.miningchallenge = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }

  // adds a new Challenge
  add() {
    this.MiningChallengeService.create( {challenge: {...this.form.value, prizedistribution:this.items }}).subscribe((res: any) => {
      if (res.status === 200) {
        this.cancel();
        this.items=[];
        this.getAllSeries();
        Toast.fire({ icon: 'success', title: 'Challenge Created Successfully' });
      }
    }, err => {
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }


  // updates Challenge
  update() {
    this.isLoader = true;
    const id = this.miningchallenge[this.updateIndex]._id;
    this.MiningChallengeService.update(id, { ...this.form.value, prizedistribution: this.items }).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        this.cancel();
        this.items = [];
        this.getAllSeries();
        Toast.fire({ icon: 'success', title: 'Challenge Updated Successfully' });
      }
    }, err => {
      this.miningchallenge = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }

  // resets all fields and variables
  cancel() {
    this.updateIndex = null;
    this.isUpdate = false;
    this.isSubmit = false;
    this.form.reset();
    this.items = [];
    this.start = '';
    this.end = '';
    this.pool = '';
  }

  // on edit Challenge
  editLevel(i) {
    this.cancel();
    this.isUpdate = true;
    this.updateIndex = i;
    this.form.patchValue(this.miningchallenge[i]);
    this.form.patchValue({ startDate: new Date(this.miningchallenge[i].startDate) });
    this.form.patchValue({ endDate: new Date(this.miningchallenge[i].endDate) });
    this.items = this.miningchallenge[i].prizedistribution;
  }
  // deletes Permanently
  deleteDB(id) {
    this.MiningChallengeService.delete(id).subscribe((res: any) => {
      if (res.status === 200) {
        this.cancel();
        this.miningchallenge = this.miningchallenge.filter(l => l._id === id);
        this.getAllSeries();
        Toast.fire({ title: 'Challenge Deleted' });
      }
    }, err => {
      this.miningchallenge = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })

  }


  // Swal Confirmation
  deleteLevel(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteDB(id);
      }
    })
  }
}
