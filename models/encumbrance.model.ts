import { EncumbranceAddressModel } from './encumbranceAddress.model';

export class EncumbranceModel {
    public publicKey: string = null;
    public fullAssetId: string = null;
    public reference: string = null;
    public amount: number = null;
    public beneficiaries: EncumbranceAddressModel[] = [];
    public administrators: EncumbranceAddressModel[] = [];
    public signature: string = null;
}
