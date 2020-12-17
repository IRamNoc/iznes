import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetupComponent } from './product-setup.component';

describe('ProductSetupComponent', () => {
  let component: ProductSetupComponent;
  let fixture: ComponentFixture<ProductSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
