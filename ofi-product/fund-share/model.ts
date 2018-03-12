import {ShareCharacteristicMandatory, ShareCharacteristicOptional} from './models/characteristic';
import {ShareCalendarMandatory} from './models/calendar';
import {ShareFeesMandatory, ShareFeesOptional} from './models/fees';
import {ShareKeyFactsMandatory, ShareKeyFactsOptional} from './models/keyFacts';
import {ShareListingOptional} from './models/listing';
import {SharePRIIPOptional} from './models/priip';
import {ShareProfileMandatory, ShareProfileOptional} from './models/profile';
import {ShareRepresentationOptional} from './models/representation';
import {ShareSolvencyOptional} from './models/solvency';
import {ShareTaxationOptional} from './models/taxation';

export class FundShare {
    calendar = {
        mandatory: new ShareCalendarMandatory()
    }
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
    listing = {
        optional: new ShareListingOptional()
    }
    priip = {
        optional: new SharePRIIPOptional()
    }
    profile = {
        mandatory: new ShareProfileMandatory(),
        optional: new ShareCharacteristicOptional()
    }
    representation = {
        optional: new ShareRepresentationOptional()
    }
    solvency = {
        optional: new ShareSolvencyOptional()
    }
    taxation = {
        optional: new ShareTaxationOptional()
    }
}