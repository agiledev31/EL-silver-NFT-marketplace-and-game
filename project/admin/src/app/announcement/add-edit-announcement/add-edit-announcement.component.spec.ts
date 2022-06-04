import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAnnouncementComponent } from './add-edit-announcement.component';

describe('AddEditAnnouncementComponent', () => {
  let component: AddEditAnnouncementComponent;
  let fixture: ComponentFixture<AddEditAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAnnouncementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
