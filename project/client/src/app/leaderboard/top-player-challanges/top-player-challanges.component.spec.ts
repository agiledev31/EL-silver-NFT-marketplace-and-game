import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlayerChallangesComponent } from './top-player-challanges.component';

describe('TopPlayerChallangesComponent', () => {
  let component: TopPlayerChallangesComponent;
  let fixture: ComponentFixture<TopPlayerChallangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopPlayerChallangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPlayerChallangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
