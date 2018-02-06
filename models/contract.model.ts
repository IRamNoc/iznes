import { PartyModel } from '@setl/core-contracts/models/party.model';
import { EncumbranceModel } from '@setl/core-contracts/models/encumbrance.model';
import { AuthorisationModel } from '@setl/core-contracts/models/authorisation.model';
import { ParameterItemModel } from '@setl/core-contracts/models/parameterItem.model';

export class ContractModel {
    public updated: boolean = false;
    public creation: number = 0;
    public hash: string = '';
    public fromaddr: string = '';
    public txtype: number = 0;
    public basechain: number = 0;
    public type_name: string = '';
    public amount: number = 0;
    public toaddr: string = '';
    public tochain: number = 0;
    public blockheight: number = 0;
    public contractdata = null;
    public authorisations: Array<AuthorisationModel> = new Array();
    public parameters: ParameterItemModel[] = [];
    public startdate: number = 0;
    public protocol: string = '';
    public expiry: number = 0;
    public parties: Array<PartyModel> = new Array();
    public addencumbrances: Array<EncumbranceModel> = new Array();
    public issuingaddress: string = '';
    public events: Array<any> = new Array();
    public metadata: object = {};
    public poa: string = '';
    // Additional Fields
    public name: string = '';
    public function: string = '';
    public __function: string = '';
    public events: Array<any> = new Array();
    public complete: boolean = false;
}

