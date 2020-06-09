import { TestBed, inject } from '@angular/core/testing';

import { TransferInOutService } from './transfer-in-out.service';

describe('TransferInOutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransferInOutService]
    });
  });

  it('should be created', inject([TransferInOutService], (service: TransferInOutService) => {
    expect(service).toBeTruthy();
  }));
});
