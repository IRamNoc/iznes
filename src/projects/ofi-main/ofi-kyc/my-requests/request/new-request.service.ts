import { KycPartySelections } from './../../../ofi-store/ofi-kyc/my-informations/model';
import { Injectable } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { ToasterService } from 'angular2-toaster';
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
    every,
} from 'lodash';
import { CustomValidators } from '@setl/utils/helper';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { setMyKycRequestedKycs, MyKycRequestedIds } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { RequestsService } from '../requests.service';
import { KycFormHelperService } from '../kyc-form-helper.service';

import {
    booleanControls,
    legalFormList,
    financialRatingList,
    sectorActivityList,
    otherSectorActivityList,
    regulatorSupervisoryAuthoritiesList,
    regulatoryStatusList,
    regulatoryStatusListID2S,
    regulatoryStatusInsurerTypeList,
    publicEstablishmentList,
    companyActivitiesList,
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
    riskAcceptanceList,
    beneficiaryTypesList,
    relationTypesList,
    holdingTypesList,
    identificationNumberList,
    listingMarketsList,
    multilateralTradingFacilitiesList,
    typeOfRevenuesList,
} from '../requests.config';

@Injectable()
export class NewRequestService {
    isProduction = false;

    legalFormList;
    financialRatingList;
    sectorActivityList;
    otherSectorActivityList;
    regulatorSupervisoryAuthoritiesList;
    regulatoryStatusList;
    regulatoryStatusListID2S;
    regulatoryStatusInsurerTypeList;
    publicEstablishmentList;
    geographicalAreaList;
    companyActivitiesList;
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
    beneficiaryTypesList;
    relationTypesList;
    holdingTypesList;
    identificationNumberTypeList;
    listingMarketsList;
    multilateralTradingFacilitiesList;
    typeOfRevenuesList;
    saveContext = '';

    /* Private Properties. */
    private subscriptions: any[] = [];

    @select(['user', 'siteSettings', 'production']) productionOb;
    /* The companies that this user was invited by. */
    public kycPartySelections: KycPartySelections;

    constructor(
        private multilingualService: MultilingualService,
        private formBuilder: FormBuilder,
        private requestsService: RequestsService,
        private ngRedux: NgRedux<any>,
        private ofiKycService: OfiKycService,
        private toasterService: ToasterService,
        private kycFormHelperService: KycFormHelperService,
    ) {
        // Subscribe for party details.
        this.kycFormHelperService.kycPartySelections$
            .subscribe((kycPartyCompanies: KycPartySelections) => {
                this.kycPartySelections = kycPartyCompanies;
            });

        this.subscriptions.push(this.productionOb.subscribe((production) => {
            this.isProduction = production;
        }));

        this.legalFormList = legalFormList;
        this.financialRatingList = financialRatingList;
        this.sectorActivityList = sectorActivityList;
        this.otherSectorActivityList = otherSectorActivityList;
        this.regulatorSupervisoryAuthoritiesList = regulatorSupervisoryAuthoritiesList;
        this.regulatoryStatusList = regulatoryStatusList;
        this.regulatoryStatusListID2S = regulatoryStatusListID2S;
        this.regulatoryStatusInsurerTypeList = regulatoryStatusInsurerTypeList;
        this.publicEstablishmentList = publicEstablishmentList;
        this.geographicalAreaList = geographicalAreaList;
        this.companyActivitiesList = companyActivitiesList;
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
        this.beneficiaryTypesList = beneficiaryTypesList;
        this.relationTypesList = relationTypesList;
        this.holdingTypesList = holdingTypesList;
        this.identificationNumberTypeList = identificationNumberList;
        this.listingMarketsList = listingMarketsList;
        this.multilateralTradingFacilitiesList = multilateralTradingFacilitiesList;
        this.typeOfRevenuesList = typeOfRevenuesList;
    }

    set context(value) {
        this.saveContext = value;
    }

    get context() {
        return this.saveContext;
    }

    /**
     * Get the current kyc context as string in this format: kycID1-KycID2, such as '3-23'
     * @param {{kycID: number; amcID: number; context: string; completedStep: string}[]} amcs
     * @return {string}
     */
    getContext(amcs: {kycID: number; amcID: number; context: string; completedStep: string}[]) {
        amcs = map(amcs, 'kycID').sort();

        const context = amcs.reduce(
            (acc, curr) => {
                const joiner = acc ? '-' : '';
                return [acc, curr].join(joiner);
            },
            '',
        );

        this.context = context;

        return context;
    }

    extractConfigData(configValue) {
        return configValue.map((singleValue, index) => {
            return {
                id: singleValue.id ? singleValue.id : singleValue.text.replace(/[^a-zA-Z0-9]/g, ''),
                text: this.multilingualService.translate(singleValue.text),
            };
        });
    }

    async createRequestForm(): Promise<FormGroup> {
        const fb = this.formBuilder;

        const selection = this.formBuilder.group({
            managementCompanies: [[], Validators.required],
        });

        const identification = await this.createIdentificationFormGroup();
        const riskProfile = await this.createRiskProfileFormGroup();
        const documents = this.createDocumentsFormGroup();
        const validation = this.createValidationFormGroup();

        return fb.group({
            selection,
            identification,
            riskProfile,
            documents,
            validation,
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
            electronicSignatureDocument: this.createDocumentFormGroup('electronicsignature', !this.isProduction),
        });
    }

    async createIdentificationFormGroup(): Promise<FormGroup> {
        const fb = this.formBuilder;

        const entity = fb.group({
            kycID: '',
            registeredCompanyName: ['', this.getLengthValidator(255)],
            commercialName: [''],
            legalForm: ['', Validators.required],
            leiCode: ['', [
                Validators.required,
                Validators.pattern(/^\w{18}\d{2}$|n\/a/i),
            ]],
            otherIdentificationNumberType: [null, this.getLengthValidator(255)],
            otherIdentificationNumberTypeSpecify: [{ value: '', disabled: true }],
            otherIdentificationNumberText: [{ value: '', disabled: true }, Validators.required],
            shareCapital: ['', [
                Validators.required,
                Validators.min(0),
            ]],
            financialRating: [''],
        });

        const location = fb.group({
            registeredCompanyAddressLine1: ['', this.getLengthValidator(255)],
            registeredCompanyAddressLine2: ['', Validators.maxLength(255)],
            registeredCompanyZipCode: ['', this.getLengthValidator(10)],
            registeredCompanyCity: ['', this.getLengthValidator()],
            registeredCompanyCountry: ['', Validators.required],
            commercialDomiciliation: 0,
            commercialAddressLine1: [{ value: '', disabled: true }, Validators.required],
            commercialAddressLine2: [{ value: '', disabled: true }],
            commercialZipCode: [{ value: '', disabled: true }, Validators.required],
            commercialCity: [{ value: '', disabled: true }, Validators.required],
            commercialCountry: [{ value: '', disabled: true }, Validators.required],
            countryTaxResidence: ['', Validators.required],
            countryRegistration: ['', Validators.required],
        });

        const generalInformation = fb.group({ entity, location });

        const companyInformation = fb.group({
            kycID: '',
            sectorActivity: ['', Validators.required],
            sectorActivityText: [
                { value: '', disabled: true },
                this.getLengthValidator(255),
            ],
            otherSectorActivity: [''],
            otherSectorActivityText: [
                { value: '', disabled: true },
                this.getLengthValidator(255),
            ],
            corporatePurpose: ['', Validators.required],
            activities: ['', Validators.required],
            investorOnBehalfThirdParties: [
                { value: '', disabled: true },
                Validators.required,
            ],
            geographicalAreaOfActivity: ['', Validators.required],
            geographicalAreaOfActivitySpecification: [
                { value: '', disabled: true },
                this.getLengthValidator(255),
            ],
            activityRegulated: 0,
            regulator: [
                { value: '', disabled: true },
                Validators.required,
            ],
            otherRegulator: [
                { value: '', disabled: true },
                Validators.required,
            ],
            regulatoryStatus: [{ value: '', disabled: true }, Validators.required],
            regulatoryStatusInsurerType: [
                { value: '', disabled: true },
                Validators.required,
            ],
            regulatoryStatusListingOther: [
                { value: '', disabled: true },
                Validators.required,
            ],
            approvalNumber: [
                { value: '', disabled: true },
                this.getLengthValidator(),
            ],
            companyListed: 0,
            listingMarkets: [
                { value: '', disabled: true },
                Validators.required,
            ],
            otherListingMarkets: [
                { value: '', disabled: true },
                Validators.required,
            ],
            multilateralTradingFacilities: [
                { value: '', disabled: true },
                Validators.required,
            ],
            otherMultilateralTradingFacilities: [
                { value: '', disabled: true },
                Validators.required,
            ],
            bloombergCode: [
                { value: '', disabled: true },
                this.getLengthValidator(),
            ],
            isinCode: [
                { value: '', disabled: true },
                [Validators.required, Validators.pattern(/^[a-zA-Z]{2}[A-Z0-9]{9}\d$/)],
            ],
            floatableShares: [
                { value: '', disabled: true },
                [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100),
                ],
            ],
            companyStateOwned: 0,
            percentCapitalHeldByState: [
                { value: '', disabled: true },
                [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100),
                ],
            ],
            balanceSheetTotal: ['', Validators.required],
            netRevenuesNetIncome: ['', [
                Validators.required,
                Validators.min(0),
            ]],
            shareholderEquity: ['', [
                Validators.required,
                Validators.min(0),
            ]],
            capitalNature: fb.group({
                equityAndReserves: '',
                generalAssets: '',
                premiumsAndContributions: '',
                saleGoodsServices: '',
                exceptionalEvents: '',
                treasury: '',
                others: '',
            },                      {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                },
            }),
            otherCapitalNature: [{ value: '', disabled: true }, Validators.required],
            geographicalOrigin1: ['', Validators.required],
            geographicalOrigin2: [
                { value: '', disabled: true },
                Validators.required,
            ],
            totalFinancialAssetsAlreadyInvested: ['', Validators.required],
            typeOfRevenues: ['', Validators.required],
            typeOfRevenuesValue: ['', [Validators.required, Validators.min(0)]],
        });

        const beneficiaries = fb.group({
            beneficiaries: fb.array([], Validators.required),
        });

        const bankingInformation = fb.group({
            kycID: '',
            custodianHolders: fb.array([this.createHolder()]),
        });

        const classificationInformation = fb.group({
            kycID: '',
            investorStatus: 0,
            optFor: 0,
            optForValues: fb.array([]),
            excludeProducts: ['', Validators.maxLength(255)],

            nonPro: fb.group({
                firstName: ['', this.getLengthValidator()],
                lastName: ['', this.getLengthValidator()],
                jobPosition: ['', this.getLengthValidator()],
                numberYearsExperienceRelatedFunction: ['', Validators.required],
                numberYearsCurrentPosition: ['', Validators.required],
                financialInstruments: ['', Validators.required],
                financialInstrumentsSpecification: [
                    { value: '', disabled: true }, Validators.required,
                ],
                marketArea: ['', Validators.required],
                natureTransactionPerYear: ['', Validators.required],
                volumeTransactionPerYear: ['', Validators.required],
                activitiesBenefitFromExperience: 0,
                activitiesBenefitFromExperienceSpecification: [
                    { value: '', disabled: true },
                    Validators.required,
                ],
                trainingKnowledgeSkills: 0,
                trainingKnowledgeSkillsSpecification: [
                    { value: '', disabled: true },
                    Validators.required,
                ],
                knowledgeUCI: 0,
                knowledgeFundsAndRisks: 0,
                prospectusKIIDUnderstanding: 0,
                knowledgeSkillsPlaceUCIOrders: 0,
            }),
        });

        const formBuilderObject = {
            generalInformation,
            companyInformation,
            beneficiaries,
            bankingInformation,
            classificationInformation,
        };

        // the kyc is only for id2s party
        const onlyID2STypeKyc = await this.kycFormHelperService.onlyID2S$.toPromise();

        if (onlyID2STypeKyc) {
            formBuilderObject.bankingInformation.disable();
        }

        return fb.group(formBuilderObject);
    }

    createOptFor(id) {
        const fb = this.formBuilder;

        return fb.group({
            id,
            opted: 0,
        });
    }

    createOptFors(amcs) {
        const optfors = [];
        const length = amcs.length || 1;

        for (let i = 0; i < length; i += 1) {
            const id = amcs[i];
            optfors.push(this.createOptFor(id));
        }

        return optfors;
    }

    async createRiskProfileFormGroup(): Promise<FormGroup> {
        const fb = this.formBuilder;

        const investmentNature = fb.group({
            kycID: '',
            naturesSameInvestmentCrossAm: 0,
            natures: fb.array([]),
        });
        const investmentObjective = fb.group({
            kycID: '',
            objectivesSameInvestmentCrossAm: 0,
            objectives: fb.array([]),
        });
        const investmentConstraint = fb.group({
            kycID: '',
            constraintsSameInvestmentCrossAm: 0,
            constraints: fb.array([]),
        });

        // the kyc is only for id2s party
        const onlyID2STypeKyc = await this.kycFormHelperService.onlyID2SOrNowCP$.toPromise();

        if (onlyID2STypeKyc) {
            investmentConstraint.get('constraints').disable();
        }

        return fb.group({
            investmentNature,
            investmentObjective,
            investmentConstraint,
        });
    }

    createDocumentsFormGroup() {
        const fb = this.formBuilder;

        return fb.group({
            common: fb.group({
                kycstatuscertifieddoc: this.createDocumentFormGroup('kycstatuscertifieddoc', !this.isProduction),
                kyckbisdoc: this.createDocumentFormGroup('kyckbisdoc', !this.isProduction),
                kycannualreportdoc: this.createDocumentFormGroup('kycannualreportdoc', !this.isProduction),
                kycidorpassportdoc: this.createDocumentFormGroup('kycidorpassportdoc', !this.isProduction),
                kyctaxcertificationdoc: this.createDocumentFormGroup('kyctaxcertificationdoc', !this.isProduction),
                kycw8benefatcadoc: this.createDocumentFormGroup('kycw8benefatcadoc', !this.isProduction),
                kyclistsigningauthoritiesdoc: this.createDocumentFormGroup('kyclistsigningauthoritiesdoc', !this.isProduction),
                kycbeneficialownerdoc: this.createDocumentFormGroup('kycbeneficialownerdoc', !this.isProduction),
                kycarticlesassociationdoc: this.createDocumentFormGroup('kycarticlesassociationdoc', !this.isProduction),
                kycdisclosureproceduredoc: this.createDocumentFormGroup('kycdisclosureproceduredoc', !this.isProduction),
                kyccompositioncommitteedoc: this.createDocumentFormGroup('kyccompositioncommitteedoc', !this.isProduction),
                kycannual3yeardoc: this.createDocumentFormGroup('kycannual3yeardoc', !this.isProduction),
                kycannual3yeartaxdoc: this.createDocumentFormGroup('kycannual3yeartaxdoc', !this.isProduction),
                kycisincodedoc: this.createDocumentFormGroup('kycisincodedoc', !this.isProduction),
                kycevidencefloatable: this.createDocumentFormGroup('kycevidencefloatable', !this.isProduction),
                kycproofofapprovaldoc: this.createDocumentFormGroup('kycproofofapprovaldoc', !this.isProduction),
                kycproofregulationdoc: this.createDocumentFormGroup('kycproofregulationdoc', !this.isProduction),
                kycwolfsbergdoc: this.createDocumentFormGroup('kycwolfsbergdoc', !this.isProduction),
                kycribdoc: this.createDocumentFormGroup('kycribdoc', !this.isProduction),
                kycinfomemorandumbdfdoc: this.createDocumentFormGroup('kycinfomemorandumbdfdoc', !this.isProduction),
                kycorgchartdoc: this.createDocumentFormGroup('kycorgchartdoc', !this.isProduction),
                kyccriticalcustomersdoc: this.createDocumentFormGroup('kyccriticalcustomersdoc', !this.isProduction),
                kycbusinessplandoc: this.createDocumentFormGroup('kycbusinessplandoc', !this.isProduction),
            }),
        });
    }

    createDocumentFormGroup(name, optional = false) {
        const group: any = {
            name: '',
            kycDocumentID: '',
            type: name,
            common: 0,
            isDefault: 0,
        };

        if (optional) {
            group.hash = '';
        } else {
            group.hash = ['', Validators.required];
        }

        return this.formBuilder.group(group);
    }

    createInvestmentNature(id): FormGroup {
        const fb = this.formBuilder;

        let fbGroup = fb.group({
            assetManagementCompanyID: id ? id : null,
            financialAssetManagementMethod: fb.group(
                {
                    internalManagement: '',
                    withAdviceOfAuthorisedThirdPartyInstitution: '',
                    mandateEntrustedToManagers: '',
                },
                {
                    validator: (formGroup) => {
                        return CustomValidators.multipleCheckboxValidator(formGroup);
                    },
                },
            ),
            frequencyFinancialTransactions: fb.group(this.transformToForm(this.frequencyList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                },
            }),
            investmentvehiclesAlreadyUsed: fb.group(this.transformToForm(this.investmentVehiclesList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                },
            }),
            investmentvehiclesAlreadyUsedSpecification: [
                {
                    value: '', disabled: true,
                }, Validators.required,
            ],
        });

        // Remove investment vechicles if we're with nowcp.
        if (this.kycPartySelections.nowCPIssuer || this.kycPartySelections.nowCPInvestor) {
            fbGroup.get('investmentvehiclesAlreadyUsed').disable();
            fbGroup.get('investmentvehiclesAlreadyUsedSpecification').disable();
        }

        return fbGroup;
    }

    createInvestmentNatures(amcs) {
        const natures = [];
        const length = amcs.length || 1;

        for (let i = 0; i < length; i += 1) {
            const id = amcs[i];
            natures.push(this.createInvestmentNature(id));
        }

        return natures;
    }

    createInvestmentObjective(id): FormGroup {
        return this.formBuilder.group({
            assetManagementCompanyID: id ? id : null,
            performanceProfile: this.formBuilder.group(this.transformToForm(this.performanceProfileList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                },
            }),
            performanceProfileSpecification: [
                {
                    value: '',
                    disabled: true,
                },
                this.getLengthValidator(255),
            ],
            clientNeeds: this.formBuilder.group(this.transformToForm(this.clientNeedsList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                },
            }),
            otherFinancialInformation: ['', Validators.maxLength(255)],
            investmentHorizonWanted: this.formBuilder.group(this.transformToForm(this.investmentHorizonList), {
                validator: (formGroup) => {
                    return CustomValidators.multipleCheckboxValidator(formGroup);
                },
            }),
            investmentHorizonWantedSpecificPeriod: [
                { value: '', disabled: true }, Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(19[5-9][0-9]|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01])$/),
                ])],
            riskProfile: ['', Validators.required],
            riskProfileCapital: [{ value: '', disabled: true }, Validators.required],
            riskAcceptance: this.formBuilder.group(
                {
                    riskAcceptanceLevel1: '',
                    riskAcceptanceLevel2: '',
                    riskAcceptanceLevel3: '',
                    riskAcceptanceLevel4: '',
                },
                {
                    validator: (formGroup) => {
                        return ((formGroup) => {
                            const level1 = formGroup.get('riskAcceptanceLevel1');
                            const level2 = formGroup.get('riskAcceptanceLevel2');
                            const level3 = formGroup.get('riskAcceptanceLevel3');
                            const level4 = formGroup.get('riskAcceptanceLevel4');

                            const riskAcceptanceLevel1 = level1.value;
                            const riskAcceptanceLevel2 = level2.value;
                            const riskAcceptanceLevel3 = level3.value;
                            const riskAcceptanceLevel4 = level4.value;

                            const total = riskAcceptanceLevel1 + riskAcceptanceLevel2 + riskAcceptanceLevel3 + riskAcceptanceLevel4;
                            const valuesFilled = every([riskAcceptanceLevel1, riskAcceptanceLevel2, riskAcceptanceLevel3, riskAcceptanceLevel4], (risk) => {
                                return !isNil(risk) && risk !== '';
                            });
                            const required = level1.touched && level2.touched && level3.touched && level4.touched && !valuesFilled;

                            if (total === 100) {
                                return null;
                            }

                            return {
                                total: true,
                                required,
                                unfilled: !valuesFilled,
                            };
                        })(formGroup);
                    },
                },
            ),
        });
    }

    createInvestmentObjectives(amcs) {
        const objectives = [];
        const length = amcs.length || 1;

        for (let i = 0; i < length; i += 1) {
            const id = amcs[i];
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
                disabled: true,
            }],
            otherPersonsAuthorised: ['', Validators.maxLength(255)],
            hasEverIssuedNeuCp: [0, Validators.required],
            hasAlreadyInvestedNeuCp: [0, Validators.required],
        });
    }

    createConstraints(amcs) {
        const constraints = [];
        const length = amcs.length || 1;

        for (let i = 0; i < length; i += 1) {
            const id = amcs[i];
            constraints.push(this.createConstraint(id));
        }

        return constraints;
    }

    createBeneficiary(): FormGroup {
        return this.formBuilder.group({
            kycID: '',
            companyBeneficiariesID: '',
            beneficiaryType: ['', Validators.required],

            common: this.formBuilder.group({
                parent: [-1, Validators.required],
                relationType: ['', Validators.required],
                address: ['', Validators.required],
                address2: '',
                zipCode: ['', this.getLengthValidator(10)],
                city: ['', this.getLengthValidator(255)],
                country: ['', Validators.required],
                countryTaxResidence: ['', Validators.required],
                holdingPercentage: ['', [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100),
                    Validators.pattern(/^\d+$/i),
                ]],
                holdingType: ['', Validators.required],
                nationality: ['', Validators.required],

                votingPercentage: ['', [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(100),
                    Validators.pattern(/^\d+$/i),
                ]],
                exerciseControl: [0, Validators.required],
                document: this.createDocumentFormGroup('kycbeneficiarydoc', !this.isProduction),
            }),
            legalPerson: this.formBuilder.group({
                legalName: ['', Validators.required],
                leiCode: ['', [
                    Validators.required,
                    Validators.pattern(/^\w{18}\d{2}$|n\/a/i),
                ]],

                nationalIdNumberType: ['', Validators.required],
                otherNationalIdNumberType: [{ value: '', disabled: true }, Validators.required],
                nationalIdNumberText: [{ value: '', disabled: true }, Validators.required],
            }),
            naturalPerson: this.formBuilder.group({
                firstName: ['', this.getLengthValidator()],
                lastName: ['', this.getLengthValidator()],
                dateOfBirth: ['', [
                    Validators.pattern(/^(19[0-9][0-9]|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01])$/),
                    Validators.required,
                ]],
                cityOfBirth: ['', this.getLengthValidator()],
                countryOfBirth: ['', Validators.required],
                isLegalRepresentative: [0, Validators.required],
                isPoliticallyExposed: [0, Validators.required],
            }),
            delete: 0,
        });
    }

    createHolder() {
        return this.formBuilder.group({
            custodianID: '',
            accountName: ['', this.getLengthValidator()],
            establishmentName: ['', this.getLengthValidator()],
            iban: ['', this.getLengthValidator().concat([CustomValidators.ibanValidator])],
            bic: ['', this.getLengthValidator().concat([CustomValidators.bicValidator])],
            addressLine1: ['', this.getLengthValidator(255)],
            addressLine2: ['', Validators.maxLength(255)],
            zipCode: ['', this.getLengthValidator(10)],
            city: ['', this.getLengthValidator()],
            country: ['', Validators.required],
        });
    }

    duplicate(selectedCompanies, kycToDuplicate, connectedWallet) {
        return this.ofiKycService.duplicate({
            managementCompanies: selectedCompanies,
            kycToDuplicate,
            investorWalletID: connectedWallet,
        });
    }

    getLengthValidator(maxLength = 45) {
        return [Validators.required, Validators.maxLength(maxLength)];
    }

    hasError(form, control: string, error: string[] = []) {
        const formControl = form.get(control);
        const invalid = formControl.touched && !formControl.valid;

        if (invalid) {
            if (!error.length) {
                return invalid;
            }
            if (error.indexOf('required') === -1 && formControl.hasError('required')) {
                return false;
            }

            return error.reduce(
                (accumulator, error) => {
                    return accumulator || formControl.hasError(error);
                },
                false,
            );
        }

        return false;
    }

    transformToForm(list) {
        const result = {};

        list.forEach((element) => {
            result[element.id] = '';
        });

        return result;
    }

    storeCurrentKycs(ids: MyKycRequestedIds) {
        const requestedKycs = setMyKycRequestedKycs(ids);
        this.ngRedux.dispatch(requestedKycs);
    }

    async createMultipleDrafts(choices, connectedWallet) {
        const ids = [];

        for (const choice of choices) {
            await this.createDraft(choice, connectedWallet).then((response) => {
                const kycID = getValue(response, [1, 'Data', 0, 'kycID']);
                const amcID = choice.id;

                ids.push({
                    kycID,
                    amcID,
                });
            }).catch((err) => {
                console.error(err);
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
            alreadyCompleted: choice.registered ? 1 : 0,
            clientFile: 0,
        });
    }

    errorPop() {
        const translation = this.multilingualService.translate('The server returned an error. Please try again later.');
        this.toasterService.pop('error', translation);
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
        return mapValues(group, (single, key) => {
            if (isArray(single)) {
                return reduce(
                    single,
                    (acc, curr) => {
                        const val = curr.id ? curr.id : curr;

                        return acc ? [acc, val].join(' ') : val;
                    },
                    '',
                );
            }

            if (isObject(single)) {
                const filtered = pickBy(single);
                return Object.keys(filtered).join(' ');
            }

            if (booleanControls.indexOf(key) !== -1) {
                return Number(single);
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
