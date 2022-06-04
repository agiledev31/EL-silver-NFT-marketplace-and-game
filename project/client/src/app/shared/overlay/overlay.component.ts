import { Component, OnInit, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit {
  @Output() overlayClick = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }
  onOverlayClick(){
    this.overlayClick.emit(true);
  }
}
