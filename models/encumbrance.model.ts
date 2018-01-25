import { EncumbranceAddressModel } from '@setl/core-contracts/models/encumbranceAddress.model';

export class EncumbranceModel {
    public publicKey: string = null;
    public fullAssetId: string = null;
    public reference: string = null;
    public amount: number = null;
    public beneficiaries: Array<EncumbranceAddressModel> = null;
    public administrators: Array<EncumbranceAddressModel> = null;
    public signature: string = null;
}