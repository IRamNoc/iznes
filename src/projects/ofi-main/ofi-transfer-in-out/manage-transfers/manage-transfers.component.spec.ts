import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTransfersComponent } from './manage-transfers.component';

describe('ManageTransfersComponent', () => {
  let component: ManageTransfersComponent;
  let fixture: ComponentFixture<ManageTransfersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTransfersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
