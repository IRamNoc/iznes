export class ShareRepresentation {
    country = new Country();
    hasCountryRepresentative?: boolean = false;
    hasCountryPayingAgent?: boolean = false;
    homeCountryRestrictions?: string = '';
}

class Country {
    deregistrationDate?: string = '';
    distributionStartDate?: string = '';
    distributionEndDate?: string = '';
    legalRegistration?: boolean = false;
    marketingDistribution?: boolean = false;
    name?: string = '';
    payingAgentName?: string = '';
    registrationDate?: string = '';
    representativeName?: string = '';
    specificRestrictions?: string = '';
}