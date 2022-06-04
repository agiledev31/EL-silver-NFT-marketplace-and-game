import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverOnlineComponent } from './silver-online.component';

describe('SilverOnlineComponent', () => {
  let component: SilverOnlineComponent;
  let fixture: ComponentFixture<SilverOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SilverOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SilverOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
