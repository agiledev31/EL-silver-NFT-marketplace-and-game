import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

declare var $: any;
@Component({
  selector: 'submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {

  @Input() label = '';
  @Input() classes = 'btn primary-btn';
  @Input() type = 'submit';
  @Input() isLoading = false;
  @Input() remainingTime: any;

  @Output() click = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }
  onClick(event: any) {
    this.click.emit(event);
  }
}
