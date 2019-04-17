import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {DebugElement, Inject, Pipe, PipeTransform} from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { ToasterService } from 'angular2-toaster';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';

import { FundShareComponent } from './component';
import { FundShareMode, userTypeEnum } from '../model';
import { FundShareTradeCycleComponent } from './trade-cycle/component';
import productConfig from '../../productConfig';
import { JasperoAlertsModule } from '@setl/jaspero-ng2-alerts';
import {
    SelectModule,
    DynamicFormsModule,
    ConfirmationService,
    APP_CONFIG,
    NumberConverterService, AppConfig,
} from '@setl/utils';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';
import { OfiFundShareFormService } from './service';
import { FileService } from '@setl/core-req-services/file/file.service';
import { MemberSocketService } from '@setl/websocket-service';
import { PdfService } from '@setl/core-req-services/pdf/pdf.service';
import { FileDownloader } from '@setl/utils/services/file-downloader/service';

const fetchInvestorShareByID = jasmine.createSpy('fetchInvestorShareByID')
    .and.returnValue(null);

const fetchFundShareDocs = jasmine.createSpy('fetchFundShareDocs')
    .and.returnValue(null);

const fetchIznesShareList = jasmine.createSpy('fetchIznesShareList')
    .and.returnValue(null);

const ofiFundShareServiceSpy = {
    fetchInvestorShareByID,
    fetchFundShareDocs,
    fetchIznesShareList,
};

const fetchUmbrellaList = jasmine.createSpy('fetchUmbrellaList')
    .and.returnValue(null);

const fetchUmbrellaByID = jasmine.createSpy('fetchUmbrellaByID')
    .and.returnValue(null);

const ofiUmbrellaFundServiceSpy = {
    fetchUmbrellaList,
    fetchUmbrellaByID,
};

const ofiManagementCompanyServiceSpy = {
    getManagementCompanyList: () => { },
    fetchInvestorManagementCompanyList: () => { },
};

const getFundList = jasmine.createSpy('getFundList')
    .and.returnValue(null);

const fetchFundByID = jasmine.createSpy('fetchFundByID')
    .and.returnValue(null);

const ofiFundServiceSpy = {
    getFundList,
    fetchFundByID,
};

const ofiCurrenciesServiceSpy = {
    getCurrencyList: () => { },
};

const multilingualServiceSpy = {
    translate: () => { },
};

const locationBackSpy = jasmine.createSpy('back')
    .and.returnValue(null);

const locationSpy = {
    back: locationBackSpy,
};

const fakeShareID = 48;
const fakeFundID = 12;
const fakeUmbrellaFundID = 98;
const fakeShare = {
    [fakeShareID]: {
        fundShareID: fakeShareID,
        draft: 0,
        fundShareName: 'Share1',
        fundID: fakeFundID,
        isin: 'DemoISIN1',
        shareClassCode: 'Class A',
        shareClassInvestmentStatus: 0,
        subscriptionStartDate: '2018-04-01',
        launchDate: '2018-04-01',
        shareClassCurrency: 0,
        iban: 'testtesttesttest',
        valuationFrequency: 0,
        historicOrForwardPricing: 0,
        hasCoupon: 1,
        couponType: 0,
        freqOfDistributionDeclaration: 0,
        status: 0,
        master: 1,
        feeder: 0,
        allowSellBuy: 0,
        sellBuyCalendar: 1,
        maximumNumDecimal: 5,
        subscriptionCategory: 2,
        subscriptionCurrency: 0,
        minInitialSubscriptionInShare: 0.00001,
        minInitialSubscriptionInAmount: 0.00001,
        minSubsequentSubscriptionInShare: 0.00001,
        minSubsequentSubscriptionInAmount: 0.00001,
        redemptionCategory: 2,
        redemptionCurrency: 0,
        minSubsequentRedemptionInShare: 0.00001,
        minSubsequentRedemptionInAmount: 0.00001,
        subscriptionTradeCyclePeriod: 0,
        numberOfPossibleSubscriptionsWithinPeriod: 1,
        weeklySubscriptionDealingDays: null,
        monthlySubscriptionDealingDays: null,
        yearlySubscriptionDealingDays: null,
        redemptionTradeCyclePeriod: 0,
        numberOfPossibleRedemptionsWithinPeriod: 1,
        weeklyRedemptionDealingDays: null,
        monthlyRedemptionDealingDays: null,
        yearlyRedemptionDealingDays: null,
        navPeriodForSubscription: 2,
        navPeriodForRedemption: 2,
        portfolioCurrencyHedge: 0,
        subscriptionCutOffTime: '18:00',
        subscriptionCutOffTimeZone: 'Europe/Paris',
        subscriptionSettlementPeriod: 1,
        redemptionCutOffTime: '12:00:00',
        redemptionCutOffTimeZone: 'Europe/Paris',
        redemptionSettlementPeriod: 1,
        subscriptionRedemptionCalendar: '0',
        maxManagementFee: 0.00001,
        maxSubscriptionFee: 0.00001,
        maxRedemptionFee: 0.00001,
        investorProfile: 0,
        mifiidChargesOngoing: 0.00001,
        mifiidChargesOneOff: 0.00001,
        mifiidTransactionCosts: 0.00001,
        mifiidServicesCosts: 0.00001,
        mifiidIncidentalCosts: 0.00001,
        keyFactOptionalData: '{\"cusip\":\"\",\"valor\":null,\"wkn\":\"\",\"bloombergCode\":\"\",\"sedol\":\"\",\"dormantStartDate\":\"\",\"dormantEndDate\":\"\",\"liquidationStartDate\":\"\",\"terminationDate\":\"\",\"terminationDateExplanation\":\"\",\"assetClass\":null,\"geographicalArea\":null,\"srri\":null,\"sri\":null,\"navHedge\":null,\"distributionPolicy\":null,\"lifecycle\":null,\"isClassUCITSEligible\":false,\"isRDRCompliant\":false,\"isRestrictedToSeparateFeeArrangement\":false,\"hasForcedRedemption\":false,\"isETF\":false,\"indexName\":\"\",\"indexCurrency\":null,\"indexType\":null,\"bloombergUnderlyingIndexCode\":\"\",\"reutersUnderlyingIndexCode\":\"\",\"denominationBase\":null,\"isETC\":false,\"isShort\":false,\"replicationMethodologyFirstLevel\":null,\"replicationMethodologySecondLevel\":null,\"hasPRIIPDataDelivery\":false,\"hasUCITSDataDelivery\":false,\"ucitsKiidUrl\":\"\",\"internalReference\":\"\",\"additionalComments\":\"\"}',
        profileOptionalData: '{\"recommendedHoldingPeriod\":null,\"benchmark\":\"\",\"outperformanceCommission\":\"\",\"peaEligibility\":false,\"isClientTypeRetail\":false,\"isClientTypeProfessional\":false,\"isClientTypeEligibleCounterparty\":false,\"withBasicKnowledge\":false,\"informed\":false,\"advanced\":false,\"noCapitalLoss\":false,\"limitedCapitalLosses\":false,\"totalCapitalLoss\":false,\"lossesBeyondCapital\":false,\"preservation\":false,\"growth\":false,\"income\":false,\"hedging\":false,\"optionsOrLeverage\":false,\"other\":false,\"executionOnlyDistribution\":null,\"executionOnlyWithAppropriatenessTest\":null,\"advisedRetailDistribution\":null,\"portfolioManagement\":null}',
        priipOptionalData: '{\"hasCreditRisk\":false,\"creditRiskMeasure\":null,\"marketRiskMeasure\":null,\"liquidityRisk\":null,\"summaryRiskIndicator\":null,\"possibleMaximumLoss\":null,\"recommendedHoldingPeriod\":null,\"maturityDate\":\"\",\"referenceDate\":\"\",\"category\":null,\"numberOfObservedReturns\":null,\"meanReturn\":null,\"volatilityOfStressedScenario\":null,\"sigma\":null,\"skewness\":null,\"excessKurtosis\":null,\"vev\":null,\"isPRIIPFlexible\":false,\"vev1\":null,\"vev2\":null,\"vev3\":null,\"lumpSumOrRegularPremiumIndicator\":null,\"investmentAmount\":null,\"return1YStressScenario\":\"\",\"return1YUnfavourable\":false,\"return1YModerate\":false,\"return1YFavourable\":false,\"halfRHPStressScenario\":\"\",\"halfRHPUnfavourable\":false,\"halfRHPModerate\":false,\"halfRHPFavourable\":false,\"rhpStressScenario\":\"\",\"rhpUnfavourable\":false,\"rhpModerate\":false,\"rhpFavourable\":false,\"bondWeight\":null,\"annualizedVolatility\":null,\"macaulayDuration\":null,\"targetMarketRetailInvestorType\":null,\"otherRiskNarrative\":null,\"hasCapitalGuarantee\":false,\"characteristics\":\"\",\"level\":\"\",\"limitations\":\"\",\"earlyExitConditions\":\"\"}',
        listingOptionalData: '{\"bloombergCodeOfListing\":\"\",\"currency\":\"\",\"date\":\"\",\"exchangePlace\":\"\",\"iNAVBloombergCode\":\"\",\"iNAVReutersCode\":\"\",\"inceptionPrice\":null,\"isPrimaryListing\":false,\"marketIdentifierCode\":\"\",\"reutersCode\":\"\",\"status\":null}',
        taxationOptionalData: '{\"tisTidReporting\":null,\"hasDailyDeliveryOfInterimProfit\":false,\"hasReducedLuxembourgTax\":false,\"luxembourgTax\":null,\"hasSwissTaxReporting\":false,\"swissTaxStatusRuling\":false,\"isEligibleForTaxDeferredFundSwitchInSpain\":false,\"hasUKReportingStatus\":false,\"ukReportingStatusValidFrom\":\"\",\"ukReportingStatusValidUntil\":\"\",\"hasUKConfirmationOfExcessAmount\":false,\"isUSTaxFormsW8W9Needed\":false,\"isFlowThroughEntityByUSTaxLaw\":false,\"fatcaStatusV2\":null,\"isSubjectToFATCAWithholdingTaxation\":false}',
        solvencyIIOptionalData: '{\"mifidSecuritiesClassification\":null,\"efamaMainEFCCategory\":null,\"efamaActiveEFCClassification\":\"\",\"hasTripartiteReport\":false,\"lastTripartiteReportDate\":\"\",\"interestRateUp\":null,\"interestRateDown\":null,\"equityTypeI\":\"\",\"equityTypeII\":\"\",\"property\":\"\",\"spreadBonds\":\"\",\"spreadStructured\":\"\",\"spreadDerivativesUp\":null,\"spreadDerivativesDown\":null,\"fxUp\":null,\"fxDown\":null}',
        representationOptionalData: '{\"hasCountryRepresentative\":false,\"representativeName\":\"\",\"hasCountryPayingAgent\":false,\"payingAgentName\":\"\",\"homeCountryRestrictions\":null,\"countryName\":\"\",\"registrationDate\":\"\",\"deregistrationDate\":\"\",\"distributionStartDate\":\"\",\"distributionEndDate\":\"\",\"legalRegistration\":false,\"marketingDistribution\":false,\"specificRestrictions\":\"\"}',
    },
};
const fakeShareDocs = {
    fundShareID: fakeShareID,
    prospectus: '1|3976746eee129958ccef20396f3436ac8a1701abbab0dd9336c20d8443ad2fbf|logo-iznes-only.png',
    kiid: '46|9d56b72a377dcd2e40a5206115f8b69879b9d22e72ccae1b774e1800151d513b|refactorman.jpg',
    annualActivityReport: null,
    semiAnnualSummary: null,
    sharesAllocation: null,
    sriPolicy: null,
    transparencyCode: null,
    businessLetter: null,
    productSheet: null,
    monthlyFinancialReport: null,
    monthlyExtraFinancialReport: null,
    quarterlyFinancialReport: null,
    quarterlyExtraFinancialReport: null,
    letterToShareholders: null,
    kid: null,
    statutoryAuditorsCertification: null,
    ept: null,
    emt: null,
    tpts2: null,
};
const fakeFund = {
    [fakeFundID]: {
        fundID: fakeFundID,
        fundName: 'Fund1',
        draft: 0,
        isFundStructure: 1,
        umbrellaFundID: fakeUmbrellaFundID,
        legalEntityIdentifier: '',
        registerOffice: null,
        registerOfficeAddress: null,
        domicile: 'AF',
        isEuDirective: 0,
        typeOfEuDirective: null,
        UcitsVersion: null,
        legalForm: 0,
        nationalNomenclatureOfLegalForm: 0,
        homeCountryLegalType: null,
        fundCreationDate: null,
        fundLaunchDate: null,
        fundCurrency: 0,
        openOrCloseEnded: 1,
        fiscalYearEnd: '2018-04',
        isFundOfFund: 1,
        managementCompanyID: 1,
        fundAdministratorID: 1,
        custodianBankID: 1,
        investmentManagerID: null,
        principlePromoterID: null,
        payingAgentID: null,
        fundManagers: null,
        transferAgentID: null,
        centralizingAgentID: null,
        isDedicatedFund: 0,
        portfolioCurrencyHedge: 1,
        globalIntermediaryIdentification: null,
        delegatedManagementCompany: null,
        investmentAdvisorID: null,
        auditorID: null,
        taxAuditorID: null,
        legalAdvisorID: null,
        directors: '',
        hasEmbeddedDirective: null,
        hasCapitalPreservation: null,
        capitalPreservationLevel: null,
        capitalPreservationPeriod: null,
        hasCppi: null,
        cppiMultiplier: null,
        hasHedgeFundStrategy: null,
        isLeveraged: null,
        has130Or30Strategy: null,
        isFundTargetingEos: null,
        isFundTargetingSri: null,
        isPassiveFund: null,
        hasSecurityLending: null,
        hasSwap: null,
        hasDurationHedge: null,
        useDefaultHolidayMgmt: null,
        holidayMgmtConfig: null,
        investmentObjective: null,
        internalReference: '',
        additionalNotes: '',
    },
};
const fakeUmbrella = {
    2: {
        umbrellaFundID: 2,
        draft: 0,
        umbrellaFundName: 'Umbrella1',
        registerOffice: 'Umbrella1',
        registerOfficeAddress: 'Test Address of the Registred Office of the Umbrella Fund',
        registerOfficeAddressLine2: 'Test Address line2 of the Registred Office of the Umbrella Fund',
        registerOfficeAddressZipCode: 'test zipCode',
        registerOfficeAddressCity: 'test city',
        registerOfficeAddressCountry: 'LU',
        legalEntityIdentifier: 'TEST',
        domicile: 'AF',
        umbrellaFundCreationDate: '2018-04-30 00:00:00',
        managementCompanyID: 1,
        fundAdministratorID: 1,
        custodianBankID: 1,
        investmentAdvisorID: '1',
        payingAgentID: '1',
        transferAgentID: null,
        centralisingAgentID: null,
        giin: null,
        delegatedManagementCompanyID: null,
        auditorID: null,
        taxAuditorID: null,
        principlePromoterID: null,
        legalAdvisorID: null,
        directors: '',
        internalReference: '',
        additionalNotes: '',
    },
};
const activatedRouteStub = {
    paramMap: new Subject(),
    queryParams: new Subject(),
};

// Stub for translate
@Pipe({ name: 'translate' })
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

describe('FundShareComponent', () => {
    let comp: FundShareComponent;
    let fixture: ComponentFixture<FundShareComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    const resetTestingModule = TestBed.resetTestingModule;

    let updateFundShareSpy;
    let setFundShareDocsValueSpy;
    let updateFundSpy;
    let updateUmbrellaSpy;
    let disableAllShareFieldsSpy;
    let setFundSpy;
    let setUmbrellaFundSpy;

    const numberConverterService = new NumberConverterService({} as AppConfig);

    beforeAll(done => (async () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                FundShareComponent,
                TranslatePipe,
                FundShareTradeCycleComponent,
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                SelectModule,
                DynamicFormsModule,
                ClarityModule,
                RouterTestingModule,
                JasperoAlertsModule,
            ],
            providers: [
                ToasterService,
                ConfirmationService,
                { provide: OfiFundShareService, useValue: ofiFundShareServiceSpy },
                { provide: OfiUmbrellaFundService, useValue: ofiUmbrellaFundServiceSpy },
                { provide: OfiManagementCompanyService, useValue: ofiManagementCompanyServiceSpy },
                { provide: OfiFundService, useValue: ofiFundServiceSpy },
                { provide: OfiCurrenciesService, useValue: ofiCurrenciesServiceSpy },
                { provide: MultilingualService, useValue: multilingualServiceSpy },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                OfiFundShareFormService,
                { provide: NgRedux, useFactory: MockNgRedux.getInstance },
                { provide: FileService, useValue: { addFile: () => { } } },
                { provide: MemberSocketService, useValue: { token: 'faketoken' } },
                { provide: PdfService, useValue: { getPdf: jasmine.createSpy('getPdf') } },
                { provide: FileDownloader, useValue: { getDownLoaderUrl: jasmine.createSpy('getDownLoaderUrl') } },
                { provide: APP_CONFIG, useValue: { MEMBER_NODE_CONNECTION: { port: 1234 } } },
                { provide: Location, useValue: locationSpy },
                { provide: 'product-config', useValue: productConfig },
                { provide: NumberConverterService, useValue: numberConverterService}
            ],
        });
        await TestBed.compileComponents();
        TestBed.resetTestingModule = () => TestBed;
    })().then(done).catch(done.fail));

    afterAll(() => {
        TestBed.resetTestingModule = resetTestingModule;
    });

    describe('Read mode as investor', () => {

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(FundShareComponent);

            comp = fixture.componentInstance;
            MockNgRedux.reset();

            comp.mode = FundShareMode.Read;
            const currentFundStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShareSelectedFund',
                'currentFundId',
            ]);
            currentFundStub.next({
                currentFundId: fakeFundID,
            });
            currentFundStub.complete();

            tick();
            fixture.detectChanges();

            updateFundShareSpy = spyOn(comp.model, 'updateFundShare')
                .and.returnValue(null);
            setFundShareDocsValueSpy = spyOn(comp.model, 'setFundShareDocsValue')
                .and.returnValue(null);
            updateFundSpy = spyOn(comp.model, 'updateFund')
                .and.returnValue(null);
            updateUmbrellaSpy = spyOn(comp.model, 'updateUmbrella')
                .and.returnValue(null);
            disableAllShareFieldsSpy = spyOn(comp.model, 'disableAllShareFields')
                .and.returnValue(null);

            de = fixture.debugElement.query(By.css('div'));
            el = de.nativeElement;
        }));

        beforeEach(() => {
            activatedRouteStub.paramMap.next(convertToParamMap({ shareId: fakeShareID }));

            const userDetailsStub = MockNgRedux.getSelectorStub([
                'user',
                'myDetail',
            ]);
            userDetailsStub.next({
                accountId: 1,
                userType: userTypeEnum.INVESTOR,
            });
            userDetailsStub.complete();

        });

        afterEach(() => {
            fetchInvestorShareByID.calls.reset();
            fetchFundShareDocs.calls.reset();
            fetchFundByID.calls.reset();
            fetchUmbrellaByID.calls.reset();
            locationBackSpy.calls.reset();
            fetchUmbrellaList.calls.reset();
            getFundList.calls.reset();

            updateFundShareSpy.calls.reset();
            setFundShareDocsValueSpy.calls.reset();
            updateFundSpy.calls.reset();
            updateUmbrellaSpy.calls.reset();
            disableAllShareFieldsSpy.calls.reset();
        });

        it('should render as investor', () => {
            const headerEl = fixture.debugElement.query(By.css('h1')).nativeElement;
            expect(headerEl.innerText).toContain('View Share');
        });

        it('should call the getInvestorShareByID method of OfiFundShareService', () => {
            const reqShareStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'requested',
            ]);
            reqShareStub.next(false);
            reqShareStub.complete();

            expect(fetchInvestorShareByID).toHaveBeenCalledTimes(1);
            expect(fetchInvestorShareByID).toHaveBeenCalledWith(fakeShareID);
        });

        it('should call the fetchFundShareDocs method of OfiFundShareService', () => {
            const reqShareDocsStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShareDocs',
                'requested',
            ]);
            reqShareDocsStub.next(false);
            reqShareDocsStub.complete();

            expect(fetchFundShareDocs).toHaveBeenCalledTimes(1);
            expect(fetchFundShareDocs).toHaveBeenCalledWith(fakeShareID);
        });

        it('should hydrate the model with share data', () => {
            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(updateFundShareSpy).toHaveBeenCalledTimes(1);
            expect(updateFundShareSpy).toHaveBeenCalledWith(fakeShare[fakeShareID], false);
        });

        it('should hydrate the model with share docs data', fakeAsync(() => {
            const shareDocsStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShareDocs',
                'fundShareDocuments',
            ]);
            shareDocsStub.next(fakeShareDocs);
            shareDocsStub.complete();
            tick();

            expect(setFundShareDocsValueSpy).toHaveBeenCalledTimes(1);
            expect(setFundShareDocsValueSpy).toHaveBeenCalledWith(fakeShareDocs);
        }));

        it('should call fetchFundByID method of OfiFundService', () => {
            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(fetchFundByID).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with fund data', () => {
            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            comp.model.fundID = fakeFundID;

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(updateFundSpy).toHaveBeenCalledTimes(1);
            expect(updateFundSpy).toHaveBeenCalledWith(fakeFund[comp.model.fundID], null);
        });

        it('should call the fetchUmbrellaByID of ofiUmbrellaFundService', () => {
            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            comp.model.fundID = fakeFundID;

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(fetchUmbrellaByID).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with umbrella data', () => {

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            comp.model.umbrellaFundID = fakeUmbrellaFundID;

            const umbrellaListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiUmbrellaFund',
                'umbrellaFundList',
                'umbrellaFundList',
            ]);
            umbrellaListStub.next(fakeUmbrella);
            umbrellaListStub.complete();

            expect(updateUmbrellaSpy).toHaveBeenCalledTimes(1);
        });

        it('should not render the tab header with audit and duplicate share buttons', () => {
            const tabHeaderEl = fixture.debugElement.queryAll(By.css('.tab-header-container'));
            expect(tabHeaderEl.length).toEqual(0);
        });

        it('should only render the back button with the label \'Back\'', () => {
            const tabFooterEl = fixture.debugElement.queryAll(By.css('clr-tab-content > div.bottom button'));
            expect(tabFooterEl.length).toEqual(1);
            expect(tabFooterEl[0].nativeElement.innerText).toEqual('Back');
        });

        it('should navigate to the last location', fakeAsync(() => {
            const tabFooterEl = fixture.debugElement.queryAll(By.css('#cancelFundShareBottom'));
            tabFooterEl[0].triggerEventHandler('click', null);

            expect(locationBackSpy).toHaveBeenCalledTimes(1);
        }));

        it('should call the disableAllShareFields method of the model', () => {
            expect(disableAllShareFieldsSpy).toHaveBeenCalledTimes(1);
        });

        it('should not call the fetchUmbrellaList of OfiUmbrellaFundService', () => {
            expect(fetchUmbrellaList).toHaveBeenCalledTimes(0);
        });

        it('should not render the fund selection section', () => {
            const fundSelectionEl = fixture.debugElement.queryAll(By.css('.selectFundFormContainer'));
            expect(fundSelectionEl.length).toEqual(0);
        });
    });

    describe('Create mode with fund pre-selection as AM', () => {

        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(FundShareComponent);

            comp = fixture.componentInstance;
            MockNgRedux.reset();

            comp.mode = FundShareMode.Create;
            const currentFundStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShareSelectedFund',
                'currentFundId',
            ]);
            currentFundStub.next({
                currentFundId: fakeFundID,
            });
            currentFundStub.complete();

            tick();
            fixture.detectChanges();

            setFundSpy = spyOn(comp.model, 'setFund')
                .and.returnValue(null);
            setUmbrellaFundSpy = spyOn(comp.model, 'setUmbrellaFund')
                .and.returnValue(null);

        }));

        beforeEach(() => {
            activatedRouteStub.queryParams.next({ fund: fakeFundID });

            const userDetailsStub = MockNgRedux.getSelectorStub([
                'user',
                'myDetail',
            ]);
            userDetailsStub.next({
                accountId: 1,
                userType: userTypeEnum.AM,
            });
            userDetailsStub.complete();
        });

        afterEach(() => {
            fetchUmbrellaList.calls.reset();
            getFundList.calls.reset();

            setFundSpy.calls.reset();
            setUmbrellaFundSpy.calls.reset();
        });

        it('should render as AM', () => {
            const headerEl = fixture.debugElement.query(By.css('h1')).nativeElement;
            expect(headerEl.innerText).toContain('Add New Share');
        });

        it('should call the getFundList method of ofiFundService', () => {
            expect(getFundList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with fund data', () => {

            expect(comp.model.fundID).toEqual(fakeFundID);

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(setFundSpy).toHaveBeenCalledTimes(1);
            expect(setFundSpy).toHaveBeenCalledWith(fakeFund[fakeFundID]);
        });

        it('should call the fetchUmbrellaList method of ofiUmbrellaFundService', () => {

            fetchUmbrellaList.calls.reset();

            comp.model.fundID = fakeFundID;
            expect(comp.mode).toEqual(FundShareMode.Create);
            expect(comp.prefill).toBeFalsy();

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(fetchUmbrellaList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with umbrella data', () => {

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            comp.model.umbrellaFundID = fakeUmbrellaFundID;

            const umbrellaListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiUmbrellaFund',
                'umbrellaFundList',
                'umbrellaFundList',
            ]);
            umbrellaListStub.next(fakeUmbrella);
            umbrellaListStub.complete();

            expect(setUmbrellaFundSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Create mode with share pre-selection as AM', () => {
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(FundShareComponent);

            comp = fixture.componentInstance;
            MockNgRedux.reset();

            comp.mode = FundShareMode.Create;
            const currentFundStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShareSelectedFund',
                'currentFundId',
            ]);
            currentFundStub.next({
                currentFundId: fakeFundID,
            });
            currentFundStub.complete();

            tick();
            fixture.detectChanges();

            updateFundShareSpy = spyOn(comp.model, 'updateFundShare')
                .and.returnValue(null);
            updateFundSpy = spyOn(comp.model, 'updateFund')
                .and.returnValue(null);
            updateUmbrellaSpy = spyOn(comp.model, 'updateUmbrella')
                .and.returnValue(null);
        }));

        beforeEach(() => {
            activatedRouteStub.queryParams.next({ prefill: fakeShareID });

            const userDetailsStub = MockNgRedux.getSelectorStub([
                'user',
                'myDetail',
            ]);
            userDetailsStub.next({
                accountId: 1,
                userType: userTypeEnum.AM,
            });
            userDetailsStub.complete();
        });

        afterEach(() => {
            getFundList.calls.reset();
            fetchIznesShareList.calls.reset();

            updateFundShareSpy.calls.reset();
            updateFundSpy.calls.reset();
            updateUmbrellaSpy.calls.reset();
        });

        it('should render as AM', () => {
            const headerEl = fixture.debugElement.query(By.css('h1')).nativeElement;
            expect(headerEl.innerText).toContain('Add New Share');
        });

        it('should call the fetchIznesShareList method of ofiFundShareService', () => {
            const reqShareStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'requested',
            ]);
            reqShareStub.next(false);
            reqShareStub.complete();

            expect(fetchIznesShareList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with share data', () => {
            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(updateFundShareSpy).toHaveBeenCalledTimes(1);
            expect(updateFundShareSpy).toHaveBeenCalledWith(fakeShare[fakeShareID], true);
        });

        it('should call the getFundList method of ofiFundService', () => {
            expect(getFundList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with fund data', () => {

            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(comp.model.fundID).toEqual(fakeFundID);

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(updateFundSpy).toHaveBeenCalledTimes(1);
            expect(updateFundSpy).toHaveBeenCalledWith(fakeFund[fakeFundID], null);
        });

        it('should call the fetchUmbrellaList method of ofiUmbrellaFundService', () => {

            fetchUmbrellaList.calls.reset();

            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(comp.model.fundID).toEqual(fakeFundID);

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(fetchUmbrellaList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with umbrella data', () => {

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            comp.model.umbrellaFundID = fakeUmbrellaFundID;

            const umbrellaListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiUmbrellaFund',
                'umbrellaFundList',
                'umbrellaFundList',
            ]);
            umbrellaListStub.next(fakeUmbrella);
            umbrellaListStub.complete();

            expect(updateUmbrellaSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Update mode as AM', () => {
        beforeEach(fakeAsync(() => {
            fixture = TestBed.createComponent(FundShareComponent);

            comp = fixture.componentInstance;
            MockNgRedux.reset();

            comp.mode = FundShareMode.Update;
            const currentFundStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShareSelectedFund',
                'currentFundId',
            ]);
            currentFundStub.next({
                currentFundId: fakeFundID,
            });
            currentFundStub.complete();

            tick();
            fixture.detectChanges();

            updateFundShareSpy = spyOn(comp.model, 'updateFundShare')
                .and.returnValue(null);
            updateFundSpy = spyOn(comp.model, 'updateFund')
                .and.returnValue(null);
            updateUmbrellaSpy = spyOn(comp.model, 'updateUmbrella')
                .and.returnValue(null);
        }));

        beforeEach(() => {
            activatedRouteStub.paramMap.next(convertToParamMap({ shareId: fakeShareID }));

            const userDetailsStub = MockNgRedux.getSelectorStub([
                'user',
                'myDetail',
            ]);
            userDetailsStub.next({
                accountId: 1,
                userType: userTypeEnum.AM,
            });
            userDetailsStub.complete();
        });

        afterEach(() => {
            getFundList.calls.reset();
            fetchIznesShareList.calls.reset();

            updateFundShareSpy.calls.reset();
            updateFundSpy.calls.reset();
            updateUmbrellaSpy.calls.reset();
        });

        it('should render as AM', () => {
            const headerEl = fixture.debugElement.query(By.css('h1')).nativeElement;
            expect(headerEl.innerText).toContain('View Share');
        });

        it('should call the fetchIznesShareList method of ofiFundShareService', () => {
            const reqShareStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'requested',
            ]);
            reqShareStub.next(false);
            reqShareStub.complete();

            expect(fetchIznesShareList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with share data', () => {
            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(updateFundShareSpy).toHaveBeenCalledTimes(1);
            expect(updateFundShareSpy).toHaveBeenCalledWith(fakeShare[fakeShareID], false);
        });

        it('should call the getFundList method of ofiFundService', () => {
            expect(getFundList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with fund data', () => {

            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(comp.model.fundID).toEqual(fakeFundID);

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(updateFundSpy).toHaveBeenCalledTimes(1);
            expect(updateFundSpy).toHaveBeenCalledWith(fakeFund[fakeFundID], null);
        });

        it('should call the fetchUmbrellaList method of ofiUmbrellaFundService', () => {

            fetchUmbrellaList.calls.reset();

            const shareListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFundShare',
                'fundShare',
            ]);
            shareListStub.next(fakeShare);
            shareListStub.complete();

            expect(comp.model.fundID).toEqual(fakeFundID);

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            expect(fetchUmbrellaList).toHaveBeenCalledTimes(1);
        });

        it('should hydrate the model with umbrella data', () => {

            const fundListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiFund',
                'fundList',
                'iznFundList',
            ]);
            fundListStub.next(fakeFund);
            fundListStub.complete();

            comp.model.umbrellaFundID = fakeUmbrellaFundID;

            const umbrellaListStub = MockNgRedux.getSelectorStub([
                'ofi',
                'ofiProduct',
                'ofiUmbrellaFund',
                'umbrellaFundList',
                'umbrellaFundList',
            ]);
            umbrellaListStub.next(fakeUmbrella);
            umbrellaListStub.complete();

            expect(updateUmbrellaSpy).toHaveBeenCalledTimes(1);
        });
    });
});
