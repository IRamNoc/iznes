import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalNotificationsComponent } from './external-notifications.component';

describe('ExternalNotificationsComponent', () => {
  let component: ExternalNotificationsComponent;
  let fixture: ComponentFixture<ExternalNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
