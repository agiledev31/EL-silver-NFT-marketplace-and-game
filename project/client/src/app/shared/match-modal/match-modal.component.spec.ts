import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchModalComponent } from './match-modal.component';

describe('MatchModalComponent', () => {
  let component: MatchModalComponent;
  let fixture: ComponentFixture<MatchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
