import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tournaments-table',
  templateUrl: './tournaments-table.component.html',
  styleUrls: ['./tournaments-table.component.css']
})
export class TournamentsTableComponent implements OnInit {
  tournaments: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
