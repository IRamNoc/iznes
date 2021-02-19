import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt502Component } from './mt502.component';

describe('Mt502Component', () => {
  let component: Mt502Component;
  let fixture: ComponentFixture<Mt502Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mt502Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mt502Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
