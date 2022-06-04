import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFTDetailsComponent } from './nftdetails.component';

describe('NFTDetailsComponent', () => {
  let component: NFTDetailsComponent;
  let fixture: ComponentFixture<NFTDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFTDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFTDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
