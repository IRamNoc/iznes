import {ShareCharacteristic} from './models/characteristic';
import {ShareFees} from './models/fees';
import {ShareKeyFacts} from './models/keyFacts';
import {ShareListing} from './models/listing';
import {SharePRIIP} from './models/priip';
import {ShareProfile} from './models/profile';
import {ShareRepresentation} from './models/representation';
import {ShareSolvency} from './models/solvency';
import {ShareTaxation} from './models/taxation';

export class FundShare {
    characteristic = new ShareCharacteristic();
    fees = new ShareFees();
    keyFacts = new ShareKeyFacts();
    listing = new ShareListing();
    priip = new SharePRIIP();
    profile = new ShareProfile();
    representation = new ShareRepresentation();
    solvency = new ShareSolvency();
    taxation = new ShareTaxation();
}