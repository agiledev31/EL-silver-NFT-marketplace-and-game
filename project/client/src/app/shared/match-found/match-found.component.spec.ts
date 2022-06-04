import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchFoundComponent } from './match-found.component';

describe('MatchFoundComponent', () => {
  let component: MatchFoundComponent;
  let fixture: ComponentFixture<MatchFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchFoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
