import { PartyModel } from '@setl/core-contracts/models/party.model';
import { EncumbranceModel } from '@setl/core-contracts/models/encumbrance.model';
import { AuthorisationModel } from '@setl/core-contracts/models/authorisation.model';
import { ParameterItemModel } from '@setl/core-contracts/models/parameterItem.model';

export class ContractModel {
    public updated: boolean = false;
    public creation: number = 0;
    public hash: string = '';
    public fromaddr: string = '';
    public fromaddr_label: string = '';
    public txtype: number = 0;
    public basechain: number = 0;
    public type_name: string = '';
    public amount: number = 0;
    public toaddr: string = '';
    public toaddr_label: string = '';
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
    public issuingaddress_label: string = '';
    public events: Array<any> = new Array();
    public metadata: object = {};
    public poa: string = '';
    public status: string = '';
    public function: string = '';
    public __function: string = '';
    public address: string = '';
    public __address: string = '';
    public timeevent: number = 0;
    public __timeevent: number = 0;
    public completed: boolean = false;
    public __completed: number = 0;
    // Additional Fields
    public name: string = '';
    public payors: string = '';
    public payees: string = '';

}

