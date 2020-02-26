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
    kycinfomemorandumbdfdoc: 'common',
    kycorgchartdoc: 'common',

    // added as new KYC work
    kyclistsigningauthoritiesdoc: 'common',
    kycbeneficialownerdoc: 'common',
    kycdisclosureproceduredoc: 'common',
    kyccompositioncommitteedoc: 'common',
    kycannual3yeardoc: 'common',
    kycannual3yeartaxdoc: 'common',
    kyccriticalcustomersdoc: 'common',
    kycbusinessplandoc: 'common',
};

class KycDocuments {
    listed?: { [documentName: string]: 'optional'|'required' };
    unlisted?: { [documentName: string]: 'optional'|'required' };
    stateOwned?: { [documentName: string]: 'optional'|'required' };
    highRiskActivity?: { [documentName: string]: 'optional'|'required' };
    highRiskCountry?: { [documentName: string]: 'optional'|'required' };
}

class DocumentMatrix {
    IZNES?: KycDocuments;
    ID2S?: KycDocuments;
    NOWCP?: KycDocuments;
}

@Injectable()
export class DocumentsService {

    public documentMatrix: DocumentMatrix = {
        NOWCP: {
            listed: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycisincodedoc: 'required',
                kycevidencefloatable: 'required',
            },
            stateOwned: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycproofregulationdoc: 'required',
            },
            unlisted: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycannual3yeardoc: 'required',
            },
            highRiskActivity: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'required',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kycannual3yeartaxdoc: 'required',
            },
            highRiskCountry: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'required',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kycannual3yeartaxdoc: 'required',
            },
        },
        ID2S: {
            listed: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycorgchartdoc: 'required',
                kycisincodedoc: 'required',
                kycevidencefloatable: 'optional',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'optional',
                kycw8benefatcadoc: 'optional',
                kyccriticalcustomersdoc: 'optional',
                kycdisclosureproceduredoc: 'optional',
                kyccompositioncommitteedoc: 'optional',
                kycbusinessplandoc: 'optional',
                kycannual3yeardoc: 'required',
            },
            stateOwned: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycorgchartdoc: 'required',
                kycproofregulationdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'optional',
                kycw8benefatcadoc: 'optional',
                kyccriticalcustomersdoc: 'optional',
                kycproofofapprovaldoc: 'optional',
                kycdisclosureproceduredoc: 'optional',
                kyccompositioncommitteedoc: 'optional',
                kycbusinessplandoc: 'optional',
                kycwolfsbergdoc: 'required',
                kycannual3yeardoc: 'required',
            },
            unlisted: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'optional',
                kycw8benefatcadoc: 'optional',
                kyccriticalcustomersdoc: 'optional',
                kycdisclosureproceduredoc: 'optional',
                kyccompositioncommitteedoc: 'optional',
                kycbusinessplandoc: 'optional',
                kycannual3yeardoc: 'required',
            },
            highRiskActivity: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'optional',
                kycw8benefatcadoc: 'optional',
                kyccriticalcustomersdoc: 'optional',
                kycdisclosureproceduredoc: 'optional',
                kyccompositioncommitteedoc: 'optional',
                kycbusinessplandoc: 'optional',
                kycannual3yeartaxdoc: 'required',
            },
            highRiskCountry: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'optional',
                kycw8benefatcadoc: 'optional',
                kyccriticalcustomersdoc: 'optional',
                kycdisclosureproceduredoc: 'optional',
                kyccompositioncommitteedoc: 'optional',
                kycbusinessplandoc: 'optional',
                kycannual3yeartaxdoc: 'required',
            },
        },
        IZNES: {
            listed: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycisincodedoc: 'required',
                kycevidencefloatable: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'required',
                kycw8benefatcadoc: 'required',
                kycannualreportdoc: 'required',
            },
            stateOwned: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycproofregulationdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'required',
                kycw8benefatcadoc: 'required',
                kycproofofapprovaldoc: 'optional',
                kycwolfsbergdoc: 'required',
                kycannualreportdoc: 'required',
            },
            unlisted: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'optional',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'required',
                kycw8benefatcadoc: 'required',
                kycannual3yeardoc: 'required',
            },
            highRiskActivity: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'required',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'required',
                kycw8benefatcadoc: 'required',
                kycannual3yeartaxdoc: 'required',
            },
            highRiskCountry: {
                kyckbisdoc: 'required',
                kyclistsigningauthoritiesdoc: 'required',
                kycribdoc: 'required',
                kycorgchartdoc: 'required',
                kycbeneficialownerdoc: 'required',
                kycidorpassportdoc: 'required',
                kycstatuscertifieddoc: 'required',
                kyctaxcertificationdoc: 'required',
                kycw8benefatcadoc: 'required',
                kycannual3yeartaxdoc: 'required',
            },
        },
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

    public shouldShowDocument (docName: string, permissions: DocumentPermissions): {
        shouldShow: boolean;
        required: boolean;
    } {
        // Map for the rules.
        const companyRulesMap = {
            isCompanyListed: 'listed',
            isCompanyUnlisted: 'unlisted',
            isStateOwn: 'stateOwned',
            isHighRiskActivity: 'highRiskActivity',
            isHighRiskCountry: 'highRiskCountry',
        };

        // Default vars.
        let shouldShow = false;
        let required = false;

        /* Loop over rules. */
        for (const rule of Object.keys(permissions.rules)) {
            const docMatrixRuleMap = companyRulesMap[rule];
            switch (true) {
                case !!(
                        permissions.companies.iznes &&
                        permissions.rules[rule] &&
                        this.documentMatrix['IZNES'][docMatrixRuleMap] &&
                        this.documentMatrix['IZNES'][docMatrixRuleMap][docName]
                    ):
                    shouldShow = true;
                    required = !!(this.documentMatrix['IZNES'][docMatrixRuleMap][docName] === 'required');
                    break;
                case !!(
                        permissions.companies.nowcp &&
                        permissions.rules[rule] &&
                        this.documentMatrix['NOWCP'][docMatrixRuleMap] &&
                        this.documentMatrix['NOWCP'][docMatrixRuleMap][docName]
                    ):
                    shouldShow = true;
                    required = !!(this.documentMatrix['NOWCP'][docMatrixRuleMap][docName] === 'required');
                    break;
                case !!(
                        permissions.companies.id2s &&
                        permissions.rules[rule] &&
                        this.documentMatrix['ID2S'][docMatrixRuleMap] &&
                        this.documentMatrix['ID2S'][docMatrixRuleMap][docName]
                    ):
                    shouldShow = true;
                    required = !!(this.documentMatrix['ID2S'][docMatrixRuleMap][docName] === 'required');
                    break;
            }
        }

        // Return document object.
        return {
            shouldShow,
            required,
        };
    }
}
