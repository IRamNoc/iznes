import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MtdashboardBaseComponent } from './mtdashboard-base.component';

describe('MtdashboardBaseComponent', () => {
  let component: MtdashboardBaseComponent;
  let fixture: ComponentFixture<MtdashboardBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MtdashboardBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MtdashboardBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
