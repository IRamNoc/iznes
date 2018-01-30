import { EncumbranceAddressModel } from '@setl/core-contracts/models/encumbranceAddress.model';

export class EncumbranceModel {
    public publicKey: string = null;
    public fullAssetId: string = null;
    public reference: string = null;
    public amount: number = null;
    public beneficiaries: Array<EncumbranceAddressModel> = new Array();
    public administrators: Array<EncumbranceAddressModel> = new Array();
    public signature: string = null;
}