import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  @Input() teams : any = [];
  @Input() isMeAlreadyJoined : boolean = false;

  @Output() joinClick = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges() {
  }
  onJoinClick() {
    this.joinClick.emit(0)
  }

}
