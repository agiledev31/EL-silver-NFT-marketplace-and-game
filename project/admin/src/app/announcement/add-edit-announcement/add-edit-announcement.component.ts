import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from 'src/app/core/services/announcement.service';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-add-edit-announcement',
  templateUrl: './add-edit-announcement.component.html',
  styleUrls: ['./add-edit-announcement.component.css']
})
export class AddEditAnnouncementComponent implements OnInit {
  id = null;
  pageMode: any = 'add';
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private announcementService: AnnouncementService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.pageMode = 'edit'
        this.get();
      }
    })
  }

  form: FormGroup;
  isSubmit = false;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.min(1), Validators.required]],
      description: ['', []],
    });
  }
  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }
    let sub = null;
    if (this.id) {
      sub = this.announcementService.update(this.id, this.form.value);
    } else {
      sub = this.announcementService.create(this.form.value);
    }
    sub.subscribe((res: any) => {
      if (res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Announcement Added' });
        this.router.navigate(['/announcement']);
      } else {
        Toast.fire({ icon: 'success', title: res.message });
      }
    }, err => {
      Toast.fire({ icon: 'error', title: err.error && err.error.message ? err.error.message : 'Something is wrong' });

    })
  }

  get() {
    this.announcementService.getById(this.id).subscribe(
      res => {
        this.form.patchValue(res.data.announcement);
        this.f.title.patchValue(res.data.announcement.title)
        this.f.description.patchValue(res.data.announcement.description)

      },
      err => Toast.fire({ icon: 'error', title: 'Something is wrong' }))
  }

}
