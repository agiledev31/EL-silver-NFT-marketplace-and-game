import {Component, Input, OnInit} from '@angular/core';
import {ConstantService} from "../../../core/services/constant.service";
import {LolChallengeService} from "../../../core/services/lolchallenge.service";

@Component({
  selector: 'app-lolchallengehistory',
  templateUrl: './lolchallengehistory.component.html',
  styleUrls: ['./lolchallengehistory.component.css']
})
export class LolchallengehistoryComponent implements OnInit {

  @Input() userId;

  page = 1;
  limit = 10;
  query = {
    status: -1,
    searchQuery: null,
  };
  totalDocs;
  userChallengeHistory: any;
  constructor( private constService: ConstantService, private lolChallengeService: LolChallengeService ) { }

  ngOnInit(): void {
    this.getUserChallengeHistory();
  }

  get tournamentStatus() {
    return this.constService.tournamentStatus;
  }

  getUserChallengeHistory() {
    this.userId = '60b1e00ec47de51901a6d992';
    this.lolChallengeService.getUserChallengehistory(this.userId).subscribe( (res: any) => {
      console.log("getUserChallengeHistory", res);
      this.userChallengeHistory = res.data.result.docs;
      this.totalDocs = res.data.result.totalDocs;
    });
  }

  onFilterChange(){

  }

  onPageChange(page) {
    this.page = page;
  }
}
