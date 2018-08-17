import { Injectable } from '@angular/core';
import { AuthorisationModel } from '../models';
@Injectable()
export class AuthorisationService {
    public fromJSON(json) {
        const authorisation = new AuthorisationModel();
        authorisation.publicKey = json[0];
        authorisation.authorisationId = json[1];
        authorisation.signature = json[2];
        authorisation.metadata = json[3];
        authorisation.refused = json[4];
        return authorisation;
    }

    public toJSON(authorisation) {
        return [
            authorisation.publicKey,
            authorisation.authorisationId,
            authorisation.signature,
            authorisation.metadata,
            authorisation.refused,
        ];
    }
}
