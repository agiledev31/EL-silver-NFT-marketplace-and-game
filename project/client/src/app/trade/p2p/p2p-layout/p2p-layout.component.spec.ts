import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pLayoutComponent } from './p2p-layout.component';

describe('P2pLayoutComponent', () => {
  let component: P2pLayoutComponent;
  let fixture: ComponentFixture<P2pLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P2pLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
