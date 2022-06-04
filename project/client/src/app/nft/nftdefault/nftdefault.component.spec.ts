import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFTDefaultComponent } from './nftdefault.component';

describe('NFTDefaultComponent', () => {
  let component: NFTDefaultComponent;
  let fixture: ComponentFixture<NFTDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFTDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFTDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
