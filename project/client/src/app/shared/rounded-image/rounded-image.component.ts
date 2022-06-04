import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'rounded-image',
  templateUrl: './rounded-image.component.html',
  styleUrls: ['./rounded-image.component.css']
})
export class RoundedImageComponent implements OnInit {
  @Input() src = null;
  constructor() { }

  ngOnInit(): void {
  }

}
