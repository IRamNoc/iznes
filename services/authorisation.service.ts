import { Injectable } from '@angular/core';
import { JsonDataService } from "@setl/core-contracts/services/jsonDataAbstract.service";
import { AuthorisationModel } from '@setl/core-contracts/models/authorisation.model';
@Injectable()
export class AuthorisationService extends JsonDataService {
    public fromJSON(json) {
        let authorisation = super.fromJSON(json, new AuthorisationModel());
        return authorisation;
    }
}