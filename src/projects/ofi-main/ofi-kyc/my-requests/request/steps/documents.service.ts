import { DocumentPermissions, DocumentMetaCache } from './documents.model';
import { Injectable } from '@angular/core';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { merge, get as getValue, values, isEmpty, filter } from 'lodash';
import * as kycHelpers from '../../kyc-form-helper';

export const documentFormPaths = {
    kycstatuscertifieddoc: 'common',
    kyckbisdoc: 'common',
    kycannualreportdoc: 'common',
    kycidorpassportdoc: 'common',
    kyctaxcertificationdoc: 'common',
    kycw8benefatcadoc: 'common',

    kycisincodedoc: 'common',
    kycevidencefloatable: 'common',

    kycproofofapprovaldoc: 'common',
    kycproofregulationdoc: 'common',
    kycwolfsbergdoc: 'common',

    kycribdoc: 'common',
    kycorgchartdoc: 'common',

    // added as new KYC work
    kyclistsigningauthoritiesdoc: 'common',
    kycbeneficialownerdoc: 'common',
    kycdisclosureproceduredoc: 'common',
    kyccompositioncommitteedoc: 'common',
    kycannual3yeardoc: 'common',
    kycannual2yeardoc: 'common',
    kycannual3yeartaxdoc: 'common',
    kyccriticalcustomersdoc: 'common',
    kycbusinessplandoc: 'common',
};

class KycDocuments {
    rule1?: { [documentName: string]: 'optional'|'required' };
    rule2?: { [documentName: string]: 'optional'|'required' };
    rule3?: { [documentName: string]: 'optional'|'required' };
    rule4?: { [documentName: string]: 'optional'|'required' };
    rule5?: { [documentName: string]: 'optional'|'required' };
    rule6?: { [documentName: string]: 'optional'|'required' };
    rule7?: { [documentName: string]: 'optional'|'required' };
    rule8?: { [documentName: string]: 'optional'|'required' };
    rule9?: { [documentName: string]: 'optional'|'required' };
}

class DocumentMatrix {
    IZNES?: KycDocuments;
    ID2S?: KycDocuments;
    NOWCP?: KycDocuments;
    IZNES_NOWCP?: KycDocuments;
    IZNES_ID2S?: KycDocuments;
    NOWCP_ID2S?: KycDocuments;
    IZNES_NOWCP_ID2S?: KycDocuments;
}

@Injectable()
export class DocumentsService {

    public documentMatrix: DocumentMatrix = {
        NOWCP: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "optional",
                kycevidencefloatable: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycannual2yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kycannual3yeartaxdoc: "required"
            }
        },
        ID2S: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "optional",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeardoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycorgchartdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            }
        },
        IZNES: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannualreportdoc: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycproofofapprovaldoc: "optional",
                kycwolfsbergdoc: "required",
                kycannualreportdoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannualreportdoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycproofofapprovaldoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            }
        },
        IZNES_NOWCP: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannualreportdoc: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycproofofapprovaldoc: "optional",
                kycwolfsbergdoc: "required",
                kycannualreportdoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannualreportdoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycproofofapprovaldoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kycannual3yeartaxdoc: "required"
            }
        },
        IZNES_ID2S: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeardoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            }
        },
        NOWCP_ID2S: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "optional",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeardoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "optional",
                kycw8benefatcadoc: "optional",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            }
        },
        IZNES_NOWCP_ID2S: {
            rule1: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule2: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeardoc: "required"
            },
            rule3: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule4: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "optional",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeardoc: "required"
            },
            rule5: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule6: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule7: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycisincodedoc: "required",
                kycevidencefloatable: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            },
            rule8: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycproofregulationdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycproofofapprovaldoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycwolfsbergdoc: "required",
                kycannual3yeartaxdoc: "required"
            },
            rule9: {
                kyckbisdoc: "required",
                kyclistsigningauthoritiesdoc: "required",
                kycribdoc: "required",
                kycorgchartdoc: "required",
                kycbeneficialownerdoc: "required",
                kycidorpassportdoc: "required",
                kycstatuscertifieddoc: "required",
                kyctaxcertificationdoc: "required",
                kycw8benefatcadoc: "required",
                kyccriticalcustomersdoc: "optional",
                kycdisclosureproceduredoc: "optional",
                kyccompositioncommitteedoc: "optional",
                kycbusinessplandoc: "optional",
                kycannual3yeartaxdoc: "required"
            }
        }
    };

    constructor(
        private requestsService: RequestsService,
        private newRequestService:  NewRequestService,
    ) {
    }

    sendRequest(form, requests, connectedWallet) {
        const promises = [];
        const context = this.newRequestService.context;
        const extracted = this.getValues(form.value);

        requests.forEach((request) => {
            const kycID = request.kycID;

            extracted.forEach((documentControl) => {
                const documentPromise = this.sendRequestDocumentControl(documentControl, connectedWallet).then((data) => {
                    const kycDocumentID = getValue(data, 'kycDocumentID');

                    if (kycDocumentID) {
                        return this.sendRequestDocumentPermission(kycID, kycDocumentID);
                    }
                });

                promises.push(documentPromise);
            });
            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestDocumentControl(controlValue, connectedWallet) {
        const messageBody = {
            RequestName: 'updatekycdocument',
            walletID: connectedWallet,
            ...controlValue,
        };

        return this.requestsService.sendRequest(messageBody).then(response => getValue(response, [1, 'Data', 0]));
    }

    sendRequestDocumentPermission(kycID, kycDocumentID) {
        const messageBody = {
            RequestName: 'updatekycdocumentpermissions',
            kycID,
            kycDocumentID,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName : 'iznesupdatecurrentstep',
            kycID,
            completedStep : 'documents',
            currentGroup : context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    getValues(formValue) {
        let merged = merge(
            {},
            getValue(formValue, 'common'),
        );

        merged = filter(merged, 'hash');
        return values(merged);
    }

    getCurrentFormDocumentsData(kycID, connectedWallet) {
        const globalDocumentsData = this.requestsService.getKycDocuments(0, connectedWallet);
        const documentsData = this.requestsService.getKycDocuments(kycID, connectedWallet);

        return Promise.all([globalDocumentsData, documentsData]);
    }

    getDocument(documentID) {
        return this.requestsService.getKycDocument(documentID);
    }

    /**
     * Returns a boolean denotes whether this document should be shown.
     *
     * @param docName {string} - The document to be checked.
     * @param permissions {DocumentPermissions} - The document permissions object.
     */

    public checkDocument (docName: string, permissions: DocumentPermissions): {
        shouldShow: boolean;
        required: boolean;
    } {
        // Default vars.
        let returnObject = {
            shouldShow: false,
            required: false,
        };
        let lookupKey = "IZNES";

        switch (true) {
            case (
                permissions.companies.iznes &&
                ! permissions.companies.id2s &&
                ! permissions.companies.nowcp
            ):
                lookupKey = "IZNES";
                break;

            case (
                !permissions.companies.iznes &&
                permissions.companies.id2s &&
                !permissions.companies.nowcp
            ):
                lookupKey = "ID2S";
                break;

            case (
                !permissions.companies.iznes &&
                !permissions.companies.id2s &&
                permissions.companies.nowcp
            ):
                lookupKey = "NOWCP";
                break;

            case (
                permissions.companies.iznes &&
                !permissions.companies.id2s &&
                permissions.companies.nowcp
            ):
                lookupKey = "IZNES_NOWCP";
                break;

            case (
                permissions.companies.iznes &&
                permissions.companies.id2s &&
                !permissions.companies.nowcp
            ):
                lookupKey = "IZNES_ID2S";
                break;

            case (
                !permissions.companies.iznes &&
                permissions.companies.id2s &&
                permissions.companies.nowcp
            ):
                lookupKey = "NOWCP_ID2S";
                break;

            case (
                permissions.companies.iznes &&
                permissions.companies.id2s &&
                permissions.companies.nowcp
            ):
                lookupKey = "IZNES_NOWCP_ID2S";
                break;
        }

        // Loop rules.
        for (const rule of Object.keys(permissions.rules)) {
            // Continue if this rule doesn't apply.
            if (!permissions.rules[rule]) {
                continue;
            }

            if (
                // Is a company in the matrix...
                this.documentMatrix[lookupKey] &&
                // ...and has a rule in this company...
                this.documentMatrix[lookupKey][rule] &&
                // ...and has this document in this rule.
                this.documentMatrix[lookupKey][rule][docName]
            ) {
                returnObject.shouldShow = true;

                /**
                 * Only set to be required if not already, enforcing any required docs, even
                 * if the user's onboarding with another party that has this do as optional.
                 */
                if (!returnObject.required) {
                    returnObject.required = !!(this.documentMatrix[lookupKey][rule][docName] === 'required');
                }
            }
        }

        // Return document object.
        return returnObject;
    }

    /**
     * Creates a permission meta cache for all documents.
     *
     * @param permissions {DocumentPermissions}
     *
     * @return {DocumentMetaCache}
     */
    public getDocumentsMeta(permissions: DocumentPermissions): DocumentMetaCache {
        // Variables.
        let document, documents = {};

        // Loop over all the documents.
        for (document of Object.keys(documentFormPaths)) {
            documents[document] = this.checkDocument(document, permissions);
        }

        /* Overriding business rules. */
        if (permissions.overrides.floating75) {
            documents['kycevidencefloatable']['required'] = true;
            documents['kycevidencefloatable']['shouldShow'] = true;
        } else {
            documents['kycevidencefloatable']['required'] = false;
            documents['kycevidencefloatable']['shouldShow'] = false;
        }

        return documents;
    }
}
