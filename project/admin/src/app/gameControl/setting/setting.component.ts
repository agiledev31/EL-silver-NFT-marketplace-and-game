import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/core/services/setting.service';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  form: FormGroup;
  isSubmit = false;
  isLoader = false;
  isUpdate: boolean = false;
  updateIndex: number = null;
  id: any = null;

  constructor(private formBuilder: FormBuilder, private settingService: SettingService) { }

  ngOnInit(): void {
    this.create();
    this.getAllSettings();
  }

  create() {
    this.form = this.formBuilder.group({
      solo: ['', Validators.required],
      fiveV5: ['', Validators.required],
      winPoint: ['', Validators.required],
      losePoint: ['', Validators.required],

    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }

    this.settingService.update(this.id, this.form.value).subscribe((res: any) => {
      if (res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Settings Updated' });
        // this.settings = res.data.setting;
      }
    }, err => {
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })

  }


  // gets all Settings
  getAllSettings() {
    this.isLoader = true;
    this.settingService.getAll().subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        this.id = res.data[0]._id;
        this.form.patchValue(res.data[0].settings)
      }
    }, err => {
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }

  // resets all fields and variables
  cancel() {
    this.getAllSettings();
  }



}
