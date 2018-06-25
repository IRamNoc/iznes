import {Injectable} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MultilingualService} from '@setl/multilingual';
import {SagaHelper} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';
import {MemberSocketService} from '@setl/websocket-service';
import {createMemberNodeSagaRequest} from '@setl/utils/common';

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
    volumeOfTransactionsList
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

    constructor(
        private multilingualService: MultilingualService,
        private formBuilder: FormBuilder,
        private ngRedux: NgRedux<any>,
        private memberSocketService: MemberSocketService
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

        const generalInformation = fb.group({
            registeredCompanyName: ['', Validators.required],
            legalForm: ['', Validators.required],
            leiCode: ['', [
                Validators.required,
                Validators.pattern(/^\w{18}\d{2}$|n\/a/i)
            ]],
            otherIdentificationNumber: '',
            registeredCompanyAddressLine1: ['', Validators.required],
            registeredCompanyAddressLine2: '',
            registeredCompanyZipCode: ['', Validators.required],
            registeredCompanyCity: ['', Validators.required],
            registeredCompanyCountry: ['', Validators.required],
            commercialDomiciliation: ['', Validators.required],
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

            activityRegulated: ['', Validators.required],
            regulator: [
                {value: '', disabled: true},
                Validators.required
            ],
            approvalNumber: [
                {value: '', disabled: true},
                Validators.required
            ],

            companyListed: ['', Validators.required],
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
                othersText: ''
            }),
            geographicalOrigin1: ['', Validators.required],
            geographicalOrigin2: [
                {value: '', disabled: true},
                Validators.required
            ],
            totalFinancialAssetsAlreadyInvested: ['', Validators.required],
        });
        const bankingInformation = fb.group({
            custodianHolderAccount: '',
            custodianHolderCustom: fb.group({
                custodianName: ['', Validators.required],
                custodianIban: ['', Validators.required],
                custodianAddressLine1: ['', Validators.required],
                custodianAddressLine2: '',
                custodianZipCode: ['', Validators.required],
                custodianCity: ['', Validators.required],
                custodianCountry: ['', Validators.required]
            })
        });
        const classificationInformation = fb.group({
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
                financialInstrumentsSpecification: ['', Validators.required],
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

        const identification = fb.group({
            generalInformation,
            companyInformation,
            bankingInformation,
            classificationInformation
        });

        return fb.group({
            selection,
            identification
        });
    }

    createBeneficiary(): FormGroup {
        return this.formBuilder.group({
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

    buildRequest(options) {
        console.log(options);

        // return new Promise((resolve, reject) => {
        //     /* Dispatch the request. */
        //     this.ngRedux.dispatch(
        //         SagaHelper.runAsync(
        //             options.successActions || [],
        //             options.failActions || [],
        //             options.taskPipe,
        //             {},
        //             (response) => {
        //                 resolve(response);
        //             },
        //             (error) => {
        //                 reject(error);
        //             }
        //         )
        //     );
        // });
    }
}