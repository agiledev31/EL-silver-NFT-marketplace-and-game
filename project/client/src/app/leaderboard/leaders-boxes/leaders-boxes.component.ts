import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-leaders-boxes',
  templateUrl: './leaders-boxes.component.html',
  styleUrls: ['./leaders-boxes.component.css']
})
export class LeadersBoxesComponent implements OnInit {

  @Input() countries: any[] | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
