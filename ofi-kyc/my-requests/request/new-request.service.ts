import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { NgRedux } from '@angular-redux/store';
import {
    map,
    get as getValue,
    filter,
    mapValues,
    isArray,
    reduce,
    pickBy,
    isObject,
    forEach,
    find,
    merge,
    isNil,
    every
} from 'lodash';

import { CustomValidators } from '@setl/utils/helper';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { MyKycSetRequestedKycs } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { RequestsService } from '../requests.service';

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
    isProduction = false;

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

    /* Private Properties. */
    private subscriptions: Array<any> = [];

    @select(['user', 'siteSettings', 'production']) productionOb;

    constructor(
        private multilingualService: MultilingualService,
        private formBuilder: FormBuilder,
        private requestsService: RequestsService,
        private ngRedux: NgRedux<any>,
        private ofiKycService: OfiKycService,
    ) {
        this.subscriptions.push(this.productionOb.subscribe((production) => {
            this.isProduction = production;
        }));

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

    getContext(amcs) {
        amcs = map(amcs, 'kycID').sort();

        let context = amcs.reduce((acc, curr) => {
            return acc + curr;
        }, '');


        this.context = context;

        return context;
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
            undersigned: ['', this.getLengthValidator()],
            actingOnBehalfOf: ['', this.getLengthValidator()],
            doneAt: ['', this.getLengthValidator()],
            doneDate: ['', Validators.required],
            positionRepresentative: ['', this.getLengthValidator()],
            electronicSignatureDocument: this.createDocumentFormGroup('electronicsignature', !this.isProduction)
        });
    }

    createIdentificationFormGroup() {
        const fb = this.formBuilder;

        const generalInformation = fb.group({
            kycID: '',
            registeredCompanyName: ['', this.getLengthValidator(255)],
            legalForm: ['', Validators.required],
            leiCode: ['', [
                Validators.required,
                Validators.pattern(/^\w{18}\d{2}$|n\/a/i)
            ]],
            otherIdentificationNumber: [null, Validators.maxLength(255)],
            registeredCompanyAddressLine1: ['', this.getLengthValidator(255)],
            registeredCompanyAddressLine2: ['', Validators.maxLength(255)],
            registeredCompanyZipCode: ['', this.getLengthValidator(10)],
            registeredCompanyCity: ['', this.getLengthValidator()],
            registeredCompanyCountry: ['', Validators.required],
            commercialDomiciliation: false,
            countryTaxResidence: ['', Validators.required],
            sectorActivity: ['', Validators.required],
            sectorActivityText: [
                { value: '', disabled: true },
                this.getLengthValidator(255)
            ],
            legalStatus: ['', Validators.required],
            legalStatusInsurerType: [
                { value: '', disabled: true },
                Validators.required
            ],
            legalStatusListingMarkets: [
                { value: '', disabled: true },
                Validators.required
            ],
            legalStatusListingOther: [
                { value: '', disabled: true },
                Validators.required
            ]
        });
        const companyInformation = fb.group({
            kycID: '',
            activities: ['', Validators.required],
            ownAccountinvestor: [
                { value: '', disabled: true },
                Validators.required
            ],
            investorOnBehalfThirdParties: [
                { value: '', disabled: true },
                Validators.required
            ],

            geographicalAreaOfActivity: ['', Validators.required],
            geographicalAreaOfActivitySpecification: [
                { value: '', disabled: true },
                this.getLengthValidator(255)
            ],

            activityRegulated: false,
            regulator: [
                { value: '', disabled: true },
                this.getLengthValidator(255)
            ],
            approvalNumber: [
                { value: '', disabled: true },
                this.getLengthValidator()
            ],

            companyListed: false,
            listingMarkets: [
                { value: '', disabled: true },
                Validators.required
            ],
            bloombergCode: [
                { value: '', disabled: true },
                this.getLengthValidator()
            ],
            isinCode: [
                { value: '', disabled: true },
                this.getLengthValidator()
            ],

            keyFinancialData: '',
            balanceSheetTotal: ['', Validators.required],

            netRevenuesNetIncome: ['', [
                Validators.required,
                Validators.min(0)
            ]],
            shareholderEquity: ['', [
                Validators.required,
                Validators.min(0)
            ]],

            beneficiaries: fb.array([this.createBeneficiary()]),
            capitalNature: fb.group({
                equityAndReserves: '',
                generalAssets: '',
                premiumsAndContributions: '',
                saleGoodsServices: '',
                exceptionalEvents: '',
                treasury: '',
                others: '',
                othersText: [{ value: '', disabled: true }, Validators.required]
            }, {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            geographicalOrigin1: ['', Validators.required],
            geographicalOrigin2: [
                { value: '', disabled: true },
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
                excludeProducts: ['', Validators.maxLength(255)],
                changeProfessionalStatus: 0
            }),
            nonPro: fb.group({
                firstName: ['', this.getLengthValidator()],
                lastName: ['', this.getLengthValidator()],
                jobPosition: ['', this.getLengthValidator()],
                numberYearsExperienceRelatedFunction: ['', Validators.required],
                numberYearsCurrentPosition: ['', Validators.required],
                financialInstruments: ['', Validators.required],
                financialInstrumentsSpecification: [
                    { value: '', disabled: true }, Validators.required
                ],
                marketArea: ['', Validators.required],
                natureTransactionPerYear: ['', Validators.required],
                volumeTransactionPerYear: ['', Validators.required],
                activitiesBenefitFromExperience: '',
                activitiesBenefitFromExperienceSpecification: [
                    { value: '', disabled: true },
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
                kyclistdirectorsdoc: this.createDocumentFormGroup('kyclistdirectorsdoc', !this.isProduction),
                kycbeneficialownersdoc: this.createDocumentFormGroup('kycbeneficialownersdoc', !this.isProduction),
                kyclistauthoriseddoc: this.createDocumentFormGroup('kyclistauthoriseddoc', !this.isProduction),
                kyctaxcertificationdoc: this.createDocumentFormGroup('kyctaxcertificationdoc', !this.isProduction),
                kycw8benefatcadoc: this.createDocumentFormGroup('kycw8benefatcadoc', true),
            }),
            pro: fb.group({
                kycproofofapprovaldoc: this.createDocumentFormGroup('kycproofofapprovaldoc', true),
                kycisincodedoc: this.createDocumentFormGroup('kycisincodedoc', true),
                kycwolfsbergdoc: this.createDocumentFormGroup('kycwolfsbergdoc', !this.isProduction),
            }),
            other: fb.group({
                kycstatuscertifieddoc: this.createDocumentFormGroup('kycstatuscertifieddoc', !this.isProduction),
                kyckbisdoc: this.createDocumentFormGroup('kyckbisdoc', !this.isProduction),
                kycannualreportdoc: this.createDocumentFormGroup('kycannualreportdoc', !this.isProduction),
                kycidorpassportdoc: this.createDocumentFormGroup('kycidorpassportdoc', !this.isProduction),
            })

        });
    }

    createDocumentFormGroup(name, optional = false) {
        let group: any = {
            name: '',
            kycDocumentID: '',
            type: name,
            common: 0,
            isDefault: 0
        };

        if (optional) {
            group.hash = '';
        } else {
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
                this.getLengthValidator(255)
            ],
            clientNeeds: this.formBuilder.group(this.transformToForm(this.clientNeedsList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            otherFinancialInformation: ['', Validators.maxLength(255)],
            investmentHorizonWanted: this.formBuilder.group(this.transformToForm(this.investmentHorizonList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                }
            }),
            investmentHorizonWantedSpecificPeriod: [{ value: '', disabled: true }, Validators.required],
            riskProfile: ['', Validators.required],
            riskProfileCapital: [{ value: '', disabled: true }, Validators.required],
            riskAcceptance: this.formBuilder.group({
                    riskAcceptanceLevel1: '',
                    riskAcceptanceLevel2: '',
                    riskAcceptanceLevel3: '',
                    riskAcceptanceLevel4: ''
                },
                {
                    validator: (formGroup) => {
                        return ((formGroup) => {
                            let level1 = formGroup.get('riskAcceptanceLevel1');
                            let level2 = formGroup.get('riskAcceptanceLevel2');
                            let level3 = formGroup.get('riskAcceptanceLevel3');
                            let level4 = formGroup.get('riskAcceptanceLevel4');

                            let riskAcceptanceLevel1 = level1.value;
                            let riskAcceptanceLevel2 = level2.value;
                            let riskAcceptanceLevel3 = level3.value;
                            let riskAcceptanceLevel4 = level4.value;

                            let total = riskAcceptanceLevel1 + riskAcceptanceLevel2 + riskAcceptanceLevel3 + riskAcceptanceLevel4;
                            let valuesFilled = every([riskAcceptanceLevel1, riskAcceptanceLevel2, riskAcceptanceLevel3, riskAcceptanceLevel4], risk => {
                                return !isNil(risk) && risk !== "";
                            });
                            let required = level1.touched && level2.touched && level3.touched && level4.touched && !valuesFilled;

                            if (total === 100) {
                                return null;
                            }

                            return {
                                total: true,
                                required,
                                unfilled: !valuesFilled
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
            statutoryConstraints: ['', Validators.maxLength(255)],
            taxConstraints: ['', Validators.maxLength(255)],
            otherConstraints: ['', Validators.maxLength(255)],
            investmentDecisionsAdHocCommittee: '',
            investmentDecisionsAdHocCommitteeSpecification: [{
                value: '',
                disabled: true
            }, this.getLengthValidator(255)],
            otherPersonsAuthorised: ['', Validators.maxLength(255)]
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
            firstName: ['', this.getLengthValidator()],
            lastName: ['', this.getLengthValidator()],
            address: ['', Validators.required],
            nationality: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            cityOfBirth: ['', this.getLengthValidator()],
            countryOfBirth: ['', Validators.required],
            document: this.createDocumentFormGroup('kycbeneficiarydoc', !this.isProduction),
            holdingPercentage: ['', [
                Validators.required,
                Validators.min(0),
                Validators.max(100)
            ]
            ],
            delete: 0,
        });
    }

    createHolderCustom() {
        return this.formBuilder.group({
            custodianID: '',
            custodianHolderAccount: '',
            custodianName: ['', this.getLengthValidator()],
            custodianIban: ['', this.getLengthValidator().concat([CustomValidators.ibanValidator])],
            custodianAddressLine1: ['', this.getLengthValidator(255)],
            custodianAddressLine2: ['', Validators.maxLength(255)],
            custodianZipCode: ['', this.getLengthValidator(10)],
            custodianCity: ['', this.getLengthValidator()],
            custodianCountry: ['', Validators.required]
        });
    }

    getLengthValidator(maxLength = 45) {
        return [Validators.required, Validators.maxLength(maxLength)];
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
            kycStatus: 0,
            alreadyCompleted: choice.registered ? 1 : 0
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