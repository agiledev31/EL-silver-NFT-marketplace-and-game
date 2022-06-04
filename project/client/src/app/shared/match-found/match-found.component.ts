import { Component, OnInit, ViewChild,Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-match-found',
  templateUrl: './match-found.component.html',
  styleUrls: ['./match-found.component.css']
})
export class MatchFoundComponent implements OnInit {

  closeResult: string | undefined;
  @ViewChild('content') content: any;
  @Output() accept = new EventEmitter<number>();
  @Output() decline = new EventEmitter<number>();
  timeLeft: number = 100;
  interval:any;
  progress = 100;
  progressBar = document.querySelector('.progress-bar');
  intervalId: any;

  constructor(private modalService: NgbModal) { }
  startTimer() {
  this.progress = 100;

    const getDownloadProgress = () => {

      if (this.progress > 0) {
        this.progress = this.progress - 1;
      }
      else {
        this.onAcceptClick()
        clearInterval(this.intervalId);
      }
    }
    this.intervalId = setInterval(getDownloadProgress, 1000);
  }


  ngOnInit(): void {
  }
  openBox() {
    this.modalService.open(this.content, { size: 'lg', centered: true });
    this.startTimer();
  }
  close() {
    this.modalService.dismissAll();
    clearInterval(this.intervalId);

  }
  onAcceptClick() {
    this.close();
    this.accept.emit(0);
  }
  onDeclineClick(){
    this.close();
    this.decline.emit(0);
  }

}
