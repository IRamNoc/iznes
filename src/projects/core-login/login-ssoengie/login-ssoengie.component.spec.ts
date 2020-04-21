import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSSOEngieComponent } from './login-ssoengie.component';

describe('LoginSSOEngieComponent', () => {
  let component: LoginSSOEngieComponent;
  let fixture: ComponentFixture<LoginSSOEngieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSSOEngieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSSOEngieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
