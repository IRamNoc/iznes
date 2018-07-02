import {Injectable} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MultilingualService} from '@setl/multilingual';
import {NgRedux} from '@angular-redux/store';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';
import {map, get as getValue, filter} from 'lodash';
import * as SagaHelper from '@setl/utils/sagaHelper';
import {FileService} from '@setl/core-req-services/file/file.service';

import {
    legalFormList,
    sectorActivityList,
    legalStatusList,
    legalStatusInsurerTypeList,
    publicEstablishmentList,
    companyActivitiesList,
    ownAccountInvestorList,
    investorOnBehalfList,
    geographicalAreaList,
    geographicalOriginTypeList,
    financialAssetsInvestedList,
    custodianHolderAccountList,
    financialInstrumentsList,
    natureOfTransactionsList,
    volumeOfTransactionsList,
    investmentVehiclesList,
    frequencyList,
    performanceProfileList,
    clientNeedsList,
    investmentHorizonList,
    riskProfileList,
    riskAcceptanceList
} from '../requests.config';

@Injectable()
export class NewRequestService {

    legalFormList;
    sectorActivityList;
    legalStatusList;
    legalStatusInsurerTypeList;
    publicEstablishmentList;
    geographicalAreaList;
    companyActivitiesList;
    ownAccountInvestorList;
    investorOnBehalfList;
    geographicalOriginTypeList;
    financialAssetsInvestedList;
    custodianHolderAccountList;
    financialInstrumentsList;
    natureOfTransactionsList;
    volumeOfTransactionsList;
    investmentVehiclesList;
    frequencyList;
    performanceProfileList;
    clientNeedsList;
    investmentHorizonList;
    riskProfileList;
    riskAcceptanceList;

    constructor(
        private multilingualService: MultilingualService,
        private formBuilder: FormBuilder,
        private ngRedux: NgRedux<any>,
        private memberSocketService: MemberSocketService,
        private fileService: FileService
    ) {
        this.legalFormList = this.extractConfigData(legalFormList);
        this.sectorActivityList = this.extractConfigData(sectorActivityList);
        this.legalStatusList = this.extractConfigData(legalStatusList);
        this.legalStatusInsurerTypeList = this.extractConfigData(legalStatusInsurerTypeList);
        this.publicEstablishmentList = this.extractConfigData(publicEstablishmentList);
        this.geographicalAreaList = this.extractConfigData(geographicalAreaList);
        this.companyActivitiesList = this.extractConfigData(companyActivitiesList);
        this.ownAccountInvestorList = this.extractConfigData(ownAccountInvestorList);
        this.investorOnBehalfList = this.extractConfigData(investorOnBehalfList);
        this.geographicalOriginTypeList = this.extractConfigData(geographicalOriginTypeList);
        this.financialAssetsInvestedList = this.extractConfigData(financialAssetsInvestedList);
        this.custodianHolderAccountList = this.extractConfigData(custodianHolderAccountList);
        this.financialInstrumentsList = this.extractConfigData(financialInstrumentsList);
        this.natureOfTransactionsList = this.extractConfigData(natureOfTransactionsList);
        this.volumeOfTransactionsList = this.extractConfigData(volumeOfTransactionsList);
        this.investmentVehiclesList = this.extractConfigData(investmentVehiclesList);
        this.frequencyList = this.extractConfigData(frequencyList);
        this.performanceProfileList = this.extractConfigData(performanceProfileList);
        this.clientNeedsList = this.extractConfigData(clientNeedsList);
        this.investmentHorizonList = this.extractConfigData(investmentHorizonList);
        this.riskProfileList = this.extractConfigData(riskProfileList);
        this.riskAcceptanceList = riskAcceptanceList;
    }

    extractConfigData(configValue) {
        return configValue.map((singleValue, index) => {
            return {
                id: singleValue.id ? singleValue.id : singleValue.text.replace(/[^a-zA-Z0-9]/g, ""),
                text: this.multilingualService.translate(singleValue.text)
            };
        });
    }

    createRequestForm(): FormGroup {
        const fb = this.formBuilder;

        const selection = this.formBuilder.group({
            managementCompanies: [[], Validators.required]
        });

        const identification = this.createIdentificationFormGroup();
        const riskProfile = this.createRiskProfileFormGroup();
        const documents = this.createDocumentsFormGroup();
        const validation = this.createValidationFormGroup();

        return fb.group({
            selection,
            identification,
            riskProfile,
            documents,
            validation
        });
    }

    createValidationFormGroup(){
        const fb = this.formBuilder;

        return fb.group({
            undersigned : ['', Validators.required],
            actingOnBehalfOf : ['', Validators.required],
            doneAt : ['', Validators.required],
            date : ['', Validators.required],
            positionRepresentative : ['', Validators.required],
            electronicSignature : ['', Validators.required]
        });
    }

    createIdentificationFormGroup() {
        const fb = this.formBuilder;

        const generalInformation = fb.group({
            kycID: '',
            registeredCompanyName: ['', Validators.required],
            legalForm: ['', Validators.required],
            leiCode: ['', [
                Validators.required,
                Validators.pattern(/^\w{18}\d{2}$|n\/a/i)
            ]],
            otherIdentificationNumber: null,
            registeredCompanyAddressLine1: ['', Validators.required],
            registeredCompanyAddressLine2: '',
            registeredCompanyZipCode: ['', Validators.required],
            registeredCompanyCity: ['', Validators.required],
            registeredCompanyCountry: ['', Validators.required],
            commercialDomiciliation: false,
            countryTaxResidence: ['', Validators.required],
            sectorActivity: ['', Validators.required],
            sectorActivityText: [
                {value: '', disabled: true},
                Validators.required
            ],
            legalStatus: ['', Validators.required],
            legalStatusInsurerType: [
                {value: '', disabled: true},
                Validators.required
            ],
            legalStatusPublicEstablishmentType: [
                {value: '', disabled: true},
                Validators.required
            ],
            legalStatusPublicEstablishmentTypeOther: [
                {value: '', disabled: true},
                Validators.required
            ],
            legalStatusListingMarkets: [
                {value: '', disabled: true},
                Validators.required
            ],
            legalStatusListingOther: [
                {value: '', disabled: true},
                Validators.required
            ]
        });
        const companyInformation = fb.group({
            kycID: '',
            activities: ['', Validators.required],
            ownAccountinvestor: [
                {value: '', disabled: true},
                Validators.required
            ],
            investorOnBehalfThirdParties: [
                {value: '', disabled: true},
                Validators.required
            ],

            geographicalAreaOfActivity: ['', Validators.required],
            geographicalAreaOfActivitySpecification: [
                {value: '', disabled: true},
                Validators.required
            ],

            activityRegulated: false,
            regulator: [
                {value: '', disabled: true},
                Validators.required
            ],
            approvalNumber: [
                {value: '', disabled: true},
                Validators.required
            ],

            companyListed: false,
            listingMarkets: [
                {value: '', disabled: true},
                Validators.required
            ],
            bloombergCode: [
                {value: '', disabled: true},
                Validators.required
            ],
            isinCode: [
                {value: '', disabled: true},
                Validators.required
            ],

            keyFinancialData: '',
            balanceSheetTotal: ['', Validators.required],

            netRevenuesNetIncome: ['', Validators.required],
            shareholderEquity: ['', Validators.required],

            beneficiaries: fb.array([this.createBeneficiary()]),
            capitalNature: fb.group({
                equityAndReserves: '',
                generalAssets: '',
                premiumsAndContributions: '',
                saleGoodsServices: '',
                treasury: '',
                others: '',
                othersText: [{value: '', disabled: true}, Validators.required]
            }),
            geographicalOrigin1: ['', Validators.required],
            geographicalOrigin2: [
                {value: '', disabled: true},
                Validators.required
            ],
            totalFinancialAssetsAlreadyInvested: ['', Validators.required],
        });
        const bankingInformation = fb.group({
            kycID: '',
            custodianHolderAccount: '',
            custodianHolderCustom: fb.array([this.createHolderCustom()])
        });
        const classificationInformation = fb.group({
            kycID: '',
            investorStatus: '',
            pro: fb.group({
                excludeProducts: '',
                changeProfessionalStatus: ''
            }),
            nonPro: fb.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                jobPosition: ['', Validators.required],
                numberYearsExperienceRelatedFunction: ['', Validators.required],
                numberYearsCurrentPosition: ['', Validators.required],
                financialInstruments: ['', Validators.required],
                financialInstrumentsSpecification: [
                    {value: '', disabled: true}, Validators.required
                ],
                marketArea: ['', Validators.required],
                natureTransactionPerYear: ['', Validators.required],
                volumeTransactionPerYear: ['', Validators.required],
                activitiesBenefitFromExperience: ['', Validators.required],
                activitiesBenefitFromExperienceSpecification: [
                    {value: '', disabled: true},
                    Validators.required
                ]
            })
        });

        return fb.group({
            generalInformation,
            companyInformation,
            bankingInformation,
            classificationInformation
        });
    }

    createRiskProfileFormGroup() {
        const fb = this.formBuilder;

        const investmentNature = fb.group({
            financialAssetManagementMethod: fb.group({
                internalManagement: '',
                withAdviceOfAuthorisedThirdPartyInstiution: '',
                mandateEntrustedToManagers: ''
            }),
            frequencyFinancialTransactions: fb.group(this.transformToForm(this.frequencyList)),
            investmentvehiclesAlreadyUsed: fb.group(this.transformToForm(this.investmentVehiclesList)),
            investmentvehiclesAlreadyUsedSpecification: [
                {
                    value: '', disabled: true
                }, Validators.required
            ]
        });
        const investmentObjective = fb.group({
            objectivesSameInvestmentCrossAm: '',
            objectives: fb.array([])
        });
        const investmentConstraint = fb.group({
            constraintsSameInvestmentCrossAm: '',
            constraints: fb.array([])
        });

        return fb.group({
            investmentNature,
            investmentObjective,
            investmentConstraint
        });
    }

    createDocumentsFormGroup() {
        const fb = this.formBuilder;

        return fb.group({
            common: fb.group({
                kyclistshareholdersdoc: this.createDocumentFormGroup('kyclistshareholdersdoc'),
                kyclistdirectorsdoc: this.createDocumentFormGroup('kyclistdirectorsdoc'),
                kycbeneficialownersdoc: this.createDocumentFormGroup('kycbeneficialownersdoc'),
                kyclistauthoriseddoc: this.createDocumentFormGroup('kyclistauthoriseddoc'),
                kyctaxcertificationdoc: this.createDocumentFormGroup('kyctaxcertificationdoc'),
                kycw8benefatcadoc: this.createDocumentFormGroup('kycw8benefatcadoc'),
            }),
            listedCompany: fb.group({
                kycproofofapprovaldoc: this.createDocumentFormGroup('kycproofofapprovaldoc'),
                kycisincodedoc: this.createDocumentFormGroup('kycisincodedoc'),
                kycwolfsbergdoc: this.createDocumentFormGroup('kycwolfsbergdoc'),
            }),
            other: fb.group({
                kycstatuscertifieddoc: this.createDocumentFormGroup('kycstatuscertifieddoc'),
                kyckbisdoc: this.createDocumentFormGroup('kyckbisdoc'),
                kycannualreportdoc: this.createDocumentFormGroup('kycannualreportdoc'),
                kycidorpassportdoc: this.createDocumentFormGroup('kycidorpassportdoc'),
            })

        });
    }

    createDocumentFormGroup(name) {
        return this.formBuilder.group({
            name: name,
            hash: '',
            type: name,
            file: []
        });
    }

    createInvestmentObjective(id) {
        return this.formBuilder.group({
            assetManagementCompanyID: id ? id : null,
            performanceProfile: this.formBuilder.group(this.transformToForm(this.performanceProfileList)),
            performanceProfileSpecification: [
                {
                    value: '',
                    disabled: true
                },
                Validators.required
            ],
            clientNeeds: this.formBuilder.group(this.transformToForm(this.clientNeedsList)),
            otherFinancialInformation: '',
            investmentHorizonWanted: this.formBuilder.group(this.transformToForm(this.investmentHorizonList)),
            investmentHorizonWantedSpecificPeriod: [{value: '', disabled: true}, Validators.required],
            riskProfile: ['', Validators.required],
            riskProfileCapital: [{value: '', disabled: true}, Validators.required],
            riskAcceptanceLevel1: '',
            riskAcceptanceLevel2: '',
            riskAcceptanceLevel3: '',
            riskAcceptanceLevel4: ''
        });
    }

    createInvestmentObjectives(amcs) {
        let objectives = [];
        let length = amcs.length || 1;

        for (let i = 0; i < length; i++) {
            let id = amcs[i];
            objectives.push(this.createInvestmentObjective(id));
        }

        return objectives;
    }

    createConstraint(id) {
        return this.formBuilder.group({
            assetManagementCompanyID: id ? id : null,
            statutoryConstraints: '',
            taxConstraints: '',
            otherConstraints: '',
            investmentDecisionsAdHocCommittee: '',
            investmentDecisionsAdHocCommitteeSpecification: [{value: '', disabled: true}, Validators.required],
            otherPersonsAuthorised: ''
        });
    }

    createConstraints(amcs) {
        let constraints = [];
        let length = amcs.length || 1;

        for (let i = 0; i < length; i++) {
            let id = amcs[i];
            constraints.push(this.createConstraint(id));
        }

        return constraints;
    }

    createBeneficiary(): FormGroup {
        return this.formBuilder.group({
            kycID: '',
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            nationality: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            cityOfBirth: ['', Validators.required],
            countryOfBirth: ['', Validators.required],
            document: ['', Validators.required],
            holdingPercentage: ['', [
                Validators.required,
                Validators.min(0),
                Validators.max(100)
            ]
            ],
        });
    }

    createHolderCustom() {
        return this.formBuilder.group({
            custodianName: ['', Validators.required],
            custodianIban: ['', Validators.required],
            custodianAddressLine1: ['', Validators.required],
            custodianAddressLine2: '',
            custodianZipCode: ['', Validators.required],
            custodianCity: ['', Validators.required],
            custodianCountry: ['', Validators.required]
        });
    }

    hasError(form, control: string, error: Array<string> = []) {
        let formControl = form.get(control);
        let invalid = formControl.touched && !formControl.valid;

        if (invalid) {
            if (!error.length) {
                return invalid;
            } else {
                return error.reduce((accumulator, error) => {
                    return accumulator || formControl.hasError(error);
                }, false);
            }
        }

        return false;
    }

    sendRequest(params) {
        const messageBody = {
            token: this.memberSocketService.token,
            ...params
        };

        return this.buildRequest({
            'taskPipe': createMemberNodeSagaRequest(this.memberSocketService, messageBody)
        });
    }

    transformToForm(list) {
        let result = {};

        list.forEach(element => {
            result[element.id] = '';
        });

        return result;
    }

    buildRequest(options) {
        return new Promise((resolve, reject) => {
            /* Dispatch the request. */
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    options.successActions || [],
                    options.failActions || [],
                    options.taskPipe,
                    {},
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        reject(error);
                    }
                )
            );
        });
    }

    uploadFile(event) {
        const asyncTaskPipe = this.fileService.addFile({
            files: filter(event.files, file => {
                return file.status !== 'uploaded-file'
            })
        });

        return new Promise((resolve, reject) => {
            let saga = SagaHelper.runAsyncCallback(asyncTaskPipe, response => {
                let fileID = getValue(response, [1, 'Data', 0, 'fileID']);
                resolve(fileID);
            }, () => {
                reject();
            });

            this.ngRedux.dispatch(saga);
        });
    }
}

export const configDate = {
    firstDayOfWeek: 'mo',
    format: 'YYYY-MM-DD',
    closeOnSelect: true,
    disableKeypress: true,
    locale: 'en',
};