import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast } from 'src/app/_constants/SwalToast';
import { ConstantService } from 'src/app/core/services/constant.service';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { TOURNAMENT_TEAMS } from 'src/app/_constants/NumTeams';
import { DateTimeValidator } from 'src/app/shared/date-time-picker/date-time.validator';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  form: FormGroup;
  isSubmit = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private tournamentService: TournamentService,
    private constService: ConstantService, config: NgbDatepickerConfig,
  ) {
    // prevents Past Date Selections
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate()
    };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    this.create()
  }
  create() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      // startDate: [new Date(), [Validators.required, DateTimeValidator]],
      startDate: ['', Validators.required],
      entryFee: ['', Validators.required],
      prize: ['', Validators.required],
      maxTeams: ['', Validators.required],
      region: ['', Validators.required],
      coverImage: ['']
    });
  }
  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }

    this.tournamentService.create({ tournament: this.form.value }).subscribe((res: any) => {
      if (res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Tournament Created' });
        this.router.navigate(['/control/tournament']);
      }
    }, err => {
      Toast.fire({ icon: 'error', title: 'Server Error' });
      
    })
  }


  get regions() {
    return this.constService.regions;
  }

  get numOfTeamsList() {
    return TOURNAMENT_TEAMS;
  }

  onUpload(fileUrl) {
    this.f.coverImage.setValue(fileUrl);
  }




}
