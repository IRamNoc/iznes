import { OfiTransferInOutModule } from './ofi-transfer-in-out.module';

describe('OfiTransferInOutModule', () => {
  let ofiTransferInOutModule: OfiTransferInOutModule;

  beforeEach(() => {
    ofiTransferInOutModule = new OfiTransferInOutModule();
  });

  it('should create an instance', () => {
    expect(ofiTransferInOutModule).toBeTruthy();
  });
});
