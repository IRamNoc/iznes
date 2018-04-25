import {FormItem, FormItemType} from '@setl/utils';
import * as E from '../FundShareEnum';

export class SharePRIIPOptional {
    hasCreditRisk: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Credit Risk',
        required: false,
        mltag: 'txt_fundshare_creditrisk'
    }
    creditRiskMeasure: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Credit Risk Measure',
        required: false,
        listItems: [
            { id: E.RiskIndicatorEnum.One, text: '1' },
            { id: E.RiskIndicatorEnum.Two, text: '2' },
            { id: E.RiskIndicatorEnum.Three, text: '3' },
            { id: E.RiskIndicatorEnum.Four, text: '4' },
            { id: E.RiskIndicatorEnum.Five, text: '5' },
            { id: E.RiskIndicatorEnum.Six, text: '6' }
        ],
        mltag: 'txt_fundshare_creditriskmeasure'
    }
    marketRiskMeasure: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Market Risk Measure – MRM',
        required: false,
        listItems: [
            { id: E.RiskIndicatorEnum.One, text: '1' },
            { id: E.RiskIndicatorEnum.Two, text: '2' },
            { id: E.RiskIndicatorEnum.Three, text: '3' },
            { id: E.RiskIndicatorEnum.Four, text: '4' },
            { id: E.RiskIndicatorEnum.Five, text: '5' },
            { id: E.RiskIndicatorEnum.Six, text: '6' },
            { id: E.RiskIndicatorEnum.Seven, text: '7' }
        ],
        mltag: 'txt_fundshare_marketriskmeasure'
    }
    liquidityRisk: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Liquidity Risk',
        required: false,
        listItems: [
            { id: E.LiquidityRiskEnum.M, text: 'M' },
            { id: E.LiquidityRiskEnum.I, text: 'I' },
            { id: E.LiquidityRiskEnum.L, text: 'L' }
        ],
        mltag: 'txt_fundshare_liquidityrisk'
    }
    summaryRiskIndicator: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Summary Risk Indicator',
        required: false,
        listItems: [
            { id: E.RiskIndicatorEnum.One, text: '1' },
            { id: E.RiskIndicatorEnum.Two, text: '2' },
            { id: E.RiskIndicatorEnum.Three, text: '3' },
            { id: E.RiskIndicatorEnum.Four, text: '4' },
            { id: E.RiskIndicatorEnum.Five, text: '5' },
            { id: E.RiskIndicatorEnum.Six, text: '6' },
            { id: E.RiskIndicatorEnum.Seven, text: '7' }
        ],
        mltag: 'txt_fundshare_summaryriskindicator'
    }
    possibleMaximumLoss: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Possible Maximum Loss',
        required: false,
        mltag: 'txt_fundshare_possmaxloss'
    }
    recommendedHoldingPeriod: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Recommended Holding Period',
        required: false,
        mltag: 'txt_fundshare_recomholdingperiod'
    }
    maturityDate: FormItem = {
        type: FormItemType.date,
        label: 'Maturity Date',
        required: false,
        mltag: 'txt_fundshare_maturitydate'
    }
    referenceDate: FormItem = {
        type: FormItemType.date,
        label: 'PRIIP Reference Date',
        required: false,
        mltag: 'txt_fundshare_refdate'
    }
    category: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Category',
        required: false,
        listItems: [
            { id: E.PRIIPCategoryEnum.One, text: '1' },
            { id: E.PRIIPCategoryEnum.Two, text: '2' },
            { id: E.PRIIPCategoryEnum.Three, text: '3' },
            { id: E.PRIIPCategoryEnum.Four, text: '4' }
        ],
        mltag: 'txt_fundshare_priipcategory'
    }
    numberOfObservedReturns: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Number Of Observed Returns',
        required: false,
        mltag: 'txt_fundshare_numobservedret'
    }
    meanReturn: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Mean Return',
        required: false,
        mltag: 'txt_fundshare_meanreturn'
    }
    volatilityOfStressedScenario: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Volatility Of Stressed Scenario',
        required: false,
        mltag: 'txt_fundshare_volstressedscenario'
    }
    sigma: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Sigma',
        required: false,
        mltag: 'txt_fundshare_sigma'
    }
    skewness: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Skewness',
        required: false,
        mltag: 'txt_fundshare_skewness'
    }
    excessKurtosis: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Excess Kurtosis',
        required: false,
        mltag: 'txt_fundshare_excesskurtosis'
    }
    vev: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV',
        required: false,
        mltag: 'txt_fundshare_priipvev'
    }
    isPRIIPFlexible: FormItem = {
        type: FormItemType.boolean,
        label: 'Is PRIIP Flexible',
        required: false,
        mltag: 'txt_fundshare_ispriipflexible'
    }
    vev1: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV-1',
        required: false,
        mltag: 'txt_fundshare_priipvev1'
    }
    vev2: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV-2',
        required: false,
        mltag: 'txt_fundshare_priipvev2'
    }
    vev3: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV-3',
        required: false,
        mltag: 'txt_fundshare_priipvev3'
    }
    lumpSumOrRegularPremiumIndicator: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Lump Sum Or Regular Premium Indicator',
        required: false,
        mltag: 'txt_fundshare_lumporregindicator'
    }
    investmentAmount: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Investment Amount',
        required: false,
        listItems: [
            { id: E.InvestmentAmountEnum.OneThousand, text: '1000' },
            { id: E.InvestmentAmountEnum.TenThousand, text: '10000' },
            { id: E.InvestmentAmountEnum.FiftyThousand, text: '50000' },
            { id: E.InvestmentAmountEnum.OneHundredThousand, text: '100000' },
            { id: E.InvestmentAmountEnum.TwoHundredThousand, text: '200000' },
            { id: E.InvestmentAmountEnum.OneMillion, text: '1000000' }
        ],
        mltag: 'txt_fundshare_investamount'
    }
    return1YStressScenario: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Return 1Y Stress Scenario',
        required: false,
        mltag: 'txt_fundshare_1ystressscenario'
    } // 1
    return1YUnfavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return 1Y Unfavourable',
        required: false,
        mltag: 'txt_fundshare_1yunfavourable'
    } // 1
    return1YModerate: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return 1Y Moderate',
        required: false,
        mltag: 'txt_fundshare_1ymoderate'
    } // 1
    return1YFavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return 1Y Favourable',
        required: false,
        mltag: 'txt_fundshare_1yfavourable'
    } // 1
    halfRHPStressScenario: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Return Half RHP Stress Scenario',
        required: false,
        mltag: 'txt_fundshare_halfrhpstressscenario'
    } // 1
    halfRHPUnfavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return Half RHP Unfavourable',
        required: false,
        mltag: 'txt_fundshare_halfrhpunfav'
    } // 1
    halfRHPModerate: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return Half RHP Moderate',
        required: false,
        mltag: 'txt_fundshare_halfrhpmoderate'
    } // 1
    halfRHPFavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return Half RHP Favourable',
        required: false,
        mltag: 'txt_fundshare_halfrhpfav'
    } // 1
    rhpStressScenario: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Return RHP Stress Scenario',
        required: false,
        mltag: 'txt_fundshare_rhpstressscenario'
    } // 1
    rhpUnfavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return RHP Unfavourable',
        required: false,
        mltag: 'txt_fundshare_rhpunfav'
    } // 1
    rhpModerate: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return RHP Moderate',
        required: false,
        mltag: 'txt_fundshare_rhpmoderate'
    } // 1
    rhpFavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return RHP Favourable',
        required: false,
        mltag: 'txt_fundshare_rhpfav'
    } // 1
    bondWeight: FormItem = {
        type: FormItemType.number,
        label: 'Bond Weight',
        required: false,
        mltag: 'txt_fundshare_bondweight'
    } // 1
    annualizedVolatility: FormItem = {
        type: FormItemType.number,
        label: 'Annualized Volatility',
        required: false,
        mltag: 'txt_fundshare_annualizedvol'
    } // 1
    macaulayDuration: FormItem = {
        type: FormItemType.number,
        label: 'Macaulay Duration',
        required: false,
        mltag: 'txt_fundshare_macauleyduration'
    } // 1
    targetMarketRetailInvestorType: FormItem = {
        type: FormItemType.number,
        label: 'Target Market Retail Investor Type',
        required: false,
        mltag: 'txt_fundshare_targetmarketretailtype'
    } // 1
    otherRiskNarrative: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Other Risk Narrative',
        required: false,
        mltag: 'txt_fundshare_otherrisknarative'
    } // 1
    hasCapitalGuarantee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Capital Guarantee',
        required: false,
        mltag: 'txt_fundshare_hascapguarantee'
    }
    characteristics: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Characteristics',
        required: false,
        mltag: 'txt_fundshare_priipcharacter'
    } // 1
    level: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Level',
        required: false,
        mltag: 'txt_fundshare_priiplevel'
    } // 1
    limitations: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Limitations',
        required: false,
        mltag: 'txt_fundshare_priiplimitations'
    } // 1
    earlyExitConditions: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Early Exit Conditions',
        required: false,
        mltag: 'txt_fundshare_earlyexitconditions'
    } // 1
}