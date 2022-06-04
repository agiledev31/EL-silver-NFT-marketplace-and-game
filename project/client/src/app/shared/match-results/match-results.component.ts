import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.css']
})
export class MatchResultsComponent implements OnInit {
  closeResult: string | undefined;
  @Input() type = 1;
  @ViewChild('content') content: any;
  @Output() home= new EventEmitter<any>();

  @Output() playAgain= new EventEmitter<any>();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  openLg() {
    this.modalService.open(this.content, { size: 'xl', backdrop:'static' });
  }
  close() {
    this.modalService.dismissAll()
  }
  onClickPlayAgain() {
    this.playAgain.emit({})
  }
  onClickHome() {
    this.home.emit({})

  }
}
