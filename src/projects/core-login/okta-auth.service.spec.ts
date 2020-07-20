import { TestBed, inject } from '@angular/core/testing';

import { OktaAuthService } from './okta-auth.service';

describe('OktaAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OktaAuthService]
    });
  });

  it('should be created', inject([OktaAuthService], (service: OktaAuthService) => {
    expect(service).toBeTruthy();
  }));
});