import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt10xInvComponent } from './mt10x-inv.component';

describe('Mt10xInvComponent', () => {
  let component: Mt10xInvComponent;
  let fixture: ComponentFixture<Mt10xInvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mt10xInvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mt10xInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
