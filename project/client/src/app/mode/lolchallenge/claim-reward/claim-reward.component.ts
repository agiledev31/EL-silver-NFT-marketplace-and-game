import { Component, Input, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
@Component({
  selector: 'app-claim-reward',
  templateUrl: './claim-reward.component.html',
  styleUrls: ['./claim-reward.component.css']
})
export class ClaimRewardComponent {
  @ViewChild('content') content: any;
  @Input() reward: number = 0;
  @Output() rewardClaimed = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal) { }
  ngOnChange(changes: SimpleChanges) {
    if (!changes.error && !_.isEmpty(changes.reward.currentValue)) {
      this.reward = changes.reward.currentValue;
    }
  }

  open() {
    this.modalService.open(this.content, { size: 'xl', centered: true });

  }
  close() {
    this.modalService.dismissAll();
    this.rewardClaimed.emit(true);
  }

}
