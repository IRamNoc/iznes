export enum ClassCodeEnum {
    ClassA,
    ClassC,
    ClassD,
    ClassR,
    ClassI,
}
export enum CurrencyEnum {
    EUR,
    USD,
    GBP,
}
export enum InvestmentStatusEnum {
    Open,
    SoftClosed,
    HardClosed,
    ClosedRedemption,
    ClosedSubscriptionRedemption,
}
export enum StatusEnum {
    Master,
    Feeder,
    NA,
}
export enum ValuationFrequencyEnum {
    Daily,
    TwiceAWeek,
    Weekly,
    TwiceAMonth,
    Monthly,
    Quarterly,
    TwiceAYear,
    Annually,
    AtLeastAnnualy,
    Other,
}
export enum PricingTypeEnum {
    Historic,
    Forward,
}
export enum CouponTypeEnum {
    Interest,
    CapitalGain,
    InterestCapitalGain,
}
export enum FrequencyOfDistributionDeclarationEnum {
    Daily,
    TwiceAWeek,
    Weekly,
    TwiceAMonth,
    Monthly,
    Quartely,
    TwiceAYear,
    Annually,
}
export enum TradeCyclePeriodEnum {
    Daily,
    Weekly,
    Monthly,
    Yearly,
}
export enum WeeklyDealingDaysEnum {
    FirstBusinessDay,
    LastBusinessDay,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
}
export enum WeeklyDealingDaysAltEnum {
    CalendarDay,
    BusinessDay,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
}
export enum MonthlyDealingDaysEnum {
    First = 1,
    Second,
    Third,
    Fourth,
    Fifth,
    Sixth,
    Seventh,
    Eigth,
    Ninth,
    Tenth,
    Eleventh,
    Twelfth,
    Thirteenth,
    Fourteenth,
    Fifteenth,
    Sixteenth,
    Seventeenth,
    Eighteenth,
    Nineteenth,
    Twentieth,
    TwentyFirst,
    TwentySecond,
    TwentyThird,
    TwentyFourth,
    TwentyFifth,
    TwentySixth,
    TwentySeventh,
    TwentyEigth,
    TwentyNinth,
    Thirtieth,
    ThirtyFirst,
    Last,
}
export enum YearlyDealingDaysEnum {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}
export enum GeographicalAreaEnum {
    Asia,
    AsiaExJapan,
    AsiaPacificExJapan,
    AsiaEM,
    Europe,
    EuropeExUK,
    EuropeEM,
    EuropeEuro,
    Global,
    GlobalEM,
    LatinAmericaEM,
    MiddleEastAfricaEM,
    UnitedKingdom,
    USA,
}
export enum NavHedgeEnum {
    No,
    YesNav,
    YesResidual,
}
export enum DistributionPolicyEnum {
    Accumulating,
    Distributing,
    Both,
}
export enum LifecycleEnum {
    Projected,
    ToBeLaunched,
    OfferingPeriod,
    Active,
    Dormant,
    InLiquidation,
    Terminated,
}
export enum IndexTypeEnum {
    Price,
    Performance,
    PerformanceNetDividends,
    PerformanceGrossDividends,
}
export enum ReplicationFirstLevelEnum {
    Physical,
    Synthetical,
    Others,
}
export enum ReplicationSecondLevelEnum {
    Full,
    Optimized,
    PhysicalBacked,
    UnfundedSwap,
    FundedSwap,
    Combination,
    Futures,
}
export enum SubscriptionCategoryEnum {
    Shares,
    Amount,
    Both,
}
export enum SubscriptionRoundingRuleEnum {
    Commercial,
    Lower,
}
export enum sharePortfolioCurrencyHedge {
    No,
    Yes,
    YesMultiCurrencyHedge,
    YesPartialNAVHedge,
    YesFullNAVHedge,
}
export enum BusinessDaysEnum {
    MinusOne = -1,
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
}
export enum TimezonesEnum {
    UTCP11,
    UTCP10,
    UTCP9,
    UTCP8,
    UTCP7,
    UTCP6,
    UTCP5,
    UTCP4,
    UTCP3,
    UTCP2,
    UTCP1,
    UTC,
    UTCM1,
    UTCM2,
    UTCM3,
    UTCM4,
    UTCM5,
    UTCM6,
    UTCM7,
    UTCM8,
    UTCM9,
    UTCM10,
    UTCM11,
}
export enum ListingStatus {
    Planned,
    Active,
    Suspended,
    Delisted,
}
export enum RiskIndicatorEnum {
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
}
export enum LiquidityRiskEnum {
    M,
    I,
    L,
}
export enum PRIIPCategoryEnum {
    One,
    Two,
    Three,
    Four,
}
export enum InvestmentAmountEnum {
    OneThousand,
    TenThousand,
    FiftyThousand,
    OneHundredThousand,
    TwoHundredThousand,
    OneMillion,
}
export enum InvestorProfileEnum {
    AllInvestors,
    ProfessionalInvestors,
    EligibleCounterparties,
}
export enum ProfileEligibilityEnum {
    Retail,
    Professional,
    Both,
    Neither,
}
export enum HomeCountryRestrictionEnum {
    No,
    Specialized,
    Restricted,
    Fund,
}
export enum MIFIDSecuritiesClassificationEnum {
    NonComplex,
    Complex,
    Others,
}
export enum EfamaMainEFCCategoryEnum {
    Equity,
    Bond,
    MultiAsset,
    MoneyMarket,
    ARIS,
    Other,
}
export enum TISTIDReportingEnum {
    YesBoth,
    TIS,
    TID,
    NoBoth,
}
export enum FatcaStatusV2Enum {
    SponsoredFFI,
    CertifiedDeemedCompliantNonRegisteringLocalBank,
    CertifiedDeemedCompliantFFILowValueAccounts,
    CertifiedDeemedCompliantSponsoredCloselyHeldInvestment,
    CertifiedDeemedCompliantLimitedLifeDebtInvestmentEntity,
    CertainInvestmentEntitiesThatDoNotMaintainFinancialAccounts,
    OwnerDocumentedFFI,
    RestrictedDistributor,
    NonreportingIGAFFI,
    ForeignGovernment,
    InternationalOrganization,
    ExemptRetirementPlans,
    EntityWhollyOwned,
    TerritoryFinancialInstitution,
    ExceptedNonfinancialGroupEntity,
    ExceptedNonfinancialStartupCompany,
    ExceptedNonfinancialEntityInLiquidationOrBankruptcy,
    FiveHundredOneCOrganisation,
    NonprofitOrganization,
    PubliclyTradedNFFEOrNFFEAffiliateOfAPubliclyTradedCorporation,
    ExceptedTerritoryNFFE,
    ActiveNFFE,
    PassiveNFFE,
    ExceptedInterAffiliateFFI,
    DirectReportingNFFE,
    SponsoredDirectReportingNFFE,
    NotAFinancialAccount,
}

export enum SellBuyCalendar {
    SubscriptionCalendar,
    RedemptionCalendar,
}

export enum SettlementPivotDate {
    NavDate,
    CutoffDate,
}

export enum ValuationReferenceDate {
    CalculationDay,
    NextWorkingDay,
}

export enum PaymentInstructionTrigger {
    NavDate,
    CutoffDate,
}
