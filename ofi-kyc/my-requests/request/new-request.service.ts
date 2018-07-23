import {Injectable} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MultilingualService} from '@setl/multilingual';
import {NgRedux} from '@angular-redux/store';
import {map, get as getValue, filter, mapValues, isArray, reduce, pickBy, isObject, forEach, find, merge} from 'lodash';

import {CustomValidators} from '@setl/utils/helper';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {MyKycSetRequestedKycs} from '@ofi/ofi-main/ofi-store/ofi-kyc';
import {RequestsService} from '../requests.service';

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
    saveContext = '';

    constructor(
        private multilingualService: MultilingualService,
        private formBuilder: FormBuilder,
        private requestsService: RequestsService,
        private ngRedux: NgRedux<any>,
        private ofiKycService: OfiKycService,
    ) {
        this.legalFormList = legalFormList;
        this.sectorActivityList = sectorActivityList;
        this.legalStatusList = legalStatusList;
        this.legalStatusInsurerTypeList = legalStatusInsurerTypeList;
        this.publicEstablishmentList = publicEstablishmentList;
        this.geographicalAreaList = geographicalAreaList;
        this.companyActivitiesList = companyActivitiesList;
        this.ownAccountInvestorList = ownAccountInvestorList;
        this.investorOnBehalfList = investorOnBehalfList;
        this.geographicalOriginTypeList = geographicalOriginTypeList;
        this.financialAssetsInvestedList = financialAssetsInvestedList;
        this.custodianHolderAccountList = custodianHolderAccountList;
        this.financialInstrumentsList = financialInstrumentsList;
        this.natureOfTransactionsList = natureOfTransactionsList;
        this.volumeOfTransactionsList = volumeOfTransactionsList;
        this.investmentVehiclesList = investmentVehiclesList;
        this.frequencyList = frequencyList;
        this.performanceProfileList = performanceProfileList;
        this.clientNeedsList = clientNeedsList;
        this.investmentHorizonList = investmentHorizonList;
        this.riskProfileList = riskProfileList;
        this.riskAcceptanceList = riskAcceptanceList;
    }

    set context(value) {
        this.saveContext = value;
    }

    get context() {
        return this.saveContext;
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

    createValidationFormGroup() {
        const fb = this.formBuilder;

        return fb.group({
            kycID: '',
            undersigned: ['', Validators.required],
            actingOnBehalfOf: ['', Validators.required],
            doneAt: ['', Validators.required],
            doneDate: ['', Validators.required],
            positionRepresentative: ['', Validators.required],
            electronicSignatureDocument: this.createDocumentFormGroup('electronicsignature')
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
            }, {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
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
            custodianHolderAccount: ['', Validators.required],
            custodianHolderCustom: fb.array([this.createHolderCustom()])
        });
        const classificationInformation = fb.group({
            kycID: '',
            investorStatus: '',
            pro: fb.group({
                excludeProducts: '',
                changeProfessionalStatus: 0
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
            kycID: '',
            financialAssetManagementMethod: fb.group({
                internalManagement: '',
                withAdviceOfAuthorisedThirdPartyInstitution: '',
                mandateEntrustedToManagers: ''
            }, {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            frequencyFinancialTransactions: fb.group(this.transformToForm(this.frequencyList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            investmentvehiclesAlreadyUsed: fb.group(this.transformToForm(this.investmentVehiclesList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            investmentvehiclesAlreadyUsedSpecification: [
                {
                    value: '', disabled: true
                }, Validators.required
            ]
        });
        const investmentObjective = fb.group({
            kycID: '',
            objectivesSameInvestmentCrossAm: false,
            objectives: fb.array([])
        });
        const investmentConstraint = fb.group({
            kycID: '',
            constraintsSameInvestmentCrossAm: false,
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
                kyclistshareholdersdoc: this.createDocumentFormGroup('kyclistshareholdersdoc', true),
                kyclistdirectorsdoc: this.createDocumentFormGroup('kyclistdirectorsdoc'),
                kycbeneficialownersdoc: this.createDocumentFormGroup('kycbeneficialownersdoc'),
                kyclistauthoriseddoc: this.createDocumentFormGroup('kyclistauthoriseddoc'),
                kyctaxcertificationdoc: this.createDocumentFormGroup('kyctaxcertificationdoc'),
                kycw8benefatcadoc: this.createDocumentFormGroup('kycw8benefatcadoc', true),
            }),
            listedCompany: fb.group({
                kycproofofapprovaldoc: this.createDocumentFormGroup('kycproofofapprovaldoc', true),
                kycisincodedoc: this.createDocumentFormGroup('kycisincodedoc', true),
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

    createDocumentFormGroup(name, optional = false) {
        let group : any = {
            name: '',
            kycDocumentID: '',
            type: name,
            common: 0,
            isDefault: 0
        };

        if(optional){
            group.hash = '';
        } else{
            group.hash = ['', Validators.required];
        }
        return this.formBuilder.group(group);
    }

    createInvestmentObjective(id): FormGroup {
        return this.formBuilder.group({
            assetManagementCompanyID: id ? id : null,
            performanceProfile: this.formBuilder.group(this.transformToForm(this.performanceProfileList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            performanceProfileSpecification: [
                {
                    value: '',
                    disabled: true
                },
                Validators.required
            ],
            clientNeeds: this.formBuilder.group(this.transformToForm(this.clientNeedsList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            otherFinancialInformation: '',
            investmentHorizonWanted: this.formBuilder.group(this.transformToForm(this.investmentHorizonList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            investmentHorizonWantedSpecificPeriod: [{value: '', disabled: true}, Validators.required],
            riskProfile: ['', Validators.required],
            riskProfileCapital: [{value: '', disabled: true}, Validators.required],
            riskAcceptance: this.formBuilder.group({
                    riskAcceptanceLevel1: '',
                    riskAcceptanceLevel2: '',
                    riskAcceptanceLevel3: '',
                    riskAcceptanceLevel4: ''
                },
                {
                    validator: (formGroup) => {
                        return ((formGroup) => {
                            let riskAcceptanceLevel1 = formGroup.get('riskAcceptanceLevel1').value;
                            let riskAcceptanceLevel2 = formGroup.get('riskAcceptanceLevel2').value;
                            let riskAcceptanceLevel3 = formGroup.get('riskAcceptanceLevel3').value;
                            let riskAcceptanceLevel4 = formGroup.get('riskAcceptanceLevel4').value;

                            let total = riskAcceptanceLevel1 + riskAcceptanceLevel2 + riskAcceptanceLevel3 + riskAcceptanceLevel4;

                            if(total === 100){
                                return null;
                            }

                            return {
                                riskAcceptance: {
                                    valid: false
                                }
                            };
                        })(formGroup);
                    }
                }
            )
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
            companyBeneficiariesID: '',
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            nationality: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            cityOfBirth: ['', Validators.required],
            countryOfBirth: ['', Validators.required],
            document: this.createDocumentFormGroup('kycbeneficiarydoc'),
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
            custodianID : '',
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

    transformToForm(list) {
        let result = {};

        list.forEach(element => {
            result[element.id] = '';
        });

        return result;
    }

    storeCurrentKycs(ids) {
        let requestedKycs = MyKycSetRequestedKycs(ids);
        this.ngRedux.dispatch(requestedKycs);
    }

    async createMultipleDrafts(choices, connectedWallet) {
        let ids = [];

        for (let choice of choices) {
            await this.createDraft(choice, connectedWallet).then(response => {
                let kycID = getValue(response, [1, 'Data', 0, 'kycID']);
                let amcID = choice.id;

                ids.push({
                    kycID,
                    amcID
                });
            });
        }

        return ids;
    }

    createDraft(choice, connectedWallet) {
        return this.ofiKycService.createKYCDraftOrWaitingApproval({
            inviteToken: choice.invitationToken ? choice.invitationToken : '',
            managementCompanyID: choice.id,
            investorWalletID: connectedWallet || 0,
            kycStatus: choice.registered ? 1 : 0
        });
    }

    /**
     * Normalizes form value for storage in database
     * For Arrays : ['dataone', 'datatwo'] => 'data one data two'
     * For Objects (list of checkboxes) : { dataOne : true, dataTwo : true, dataThree : false, dataFour : null } => 'dataOne dataTwo'
     *
     * @param group : Array|Object|String
     * @returns String
     */
    getValues(group) {
        return mapValues(group, single => {
            if (isArray(single)) {
                return reduce(single, (acc, curr) => {
                    let val = curr.id ? curr.id : curr;

                    return acc ? [acc, val].join(' ') : val;
                }, '')
            } else if (isObject(single)) {
                let filtered = pickBy(single);
                return Object.keys(filtered).join(' ');
            }

            return single;
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