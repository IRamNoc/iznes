import { PartyModel } from '@setl/core-contracts/models/party.model';
import { EncumbranceModel } from '@setl/core-contracts/models/encumbrance.model';
import { AuthorisationModel } from '@setl/core-contracts/models/authorisation.model';
import { ParameterItemModel } from '@setl/core-contracts/models/parameterItem.model';

export class ContractModel {
    public updated: boolean = false;
    public creation: number = null;
    public hash: string = null;
    public fromaddr: string = null;
    public txtype: number = null;
    public basechain: number = null;
    public type_name: string = null;
    public amount: number = null;
    public toaddr: string = null;
    public tochain: number = null;
    public blockheight: number = null;
    public contractdata: object = null;
    public authorisations: Array<AuthorisationModel> = null;
    public parameters: Array<ParameterItemModel> = null;
    public startdate: string = null;
    public protocol: string = null;
    public expiry: string = null;
    public parties: Array<PartyModel> = null;
    public encumbrance: Array<EncumbranceModel> = null;
    public issuingaddress: string = null;
    public events: Array<any> = null;
    public metadata: object = null;
    public poa: string = null;
    // Additional Fields
    public name: string = null;
    public complete: boolean = false;
}

