import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mt10xAmComponent } from './mt10x-am.component';

describe('Mt10xAmComponent', () => {
  let component: Mt10xAmComponent;
  let fixture: ComponentFixture<Mt10xAmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mt10xAmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mt10xAmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
