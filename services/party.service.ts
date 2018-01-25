import { Injectable } from '@angular/core';
import { JsonDataService } from "@setl/core-contracts/services/jsonDataAbstract.service";
import { PartyModel } from '@setl/core-contracts/models/party.model';
@Injectable()
export class PartyService extends JsonDataService {
    public fromJSON(json) {
        let party = super.fromJSON(json, new PartyModel());
        return party;
    }
}