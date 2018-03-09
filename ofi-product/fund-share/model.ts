import {ShareCharacteristicMandatory, ShareCharacteristicOptional} from './models/characteristic';
import {ShareFeesMandatory, ShareFeesOptional} from './models/fees';
import {ShareKeyFactsMandatory, ShareKeyFactsOptional} from './models/keyFacts';
import {ShareListing} from './models/listing';
import {SharePRIIP} from './models/priip';
import {ShareProfile} from './models/profile';
import {ShareRepresentation} from './models/representation';
import {ShareSolvency} from './models/solvency';
import {ShareTaxation} from './models/taxation';

export class FundShare {
    characteristic = {
        mandatory: new ShareCharacteristicMandatory(),
        optional: new ShareCharacteristicOptional()
    }
    fees = {
        mandatory: new ShareFeesMandatory(),
        optional: new ShareFeesOptional()
    }
    keyFacts = {
        mandatory: new ShareKeyFactsMandatory(),
        optional: new ShareKeyFactsOptional()
    }
    listing = new ShareListing();
    priip = new SharePRIIP();
    profile = new ShareProfile();
    representation = new ShareRepresentation();
    solvency = new ShareSolvency();
    taxation = new ShareTaxation();
}