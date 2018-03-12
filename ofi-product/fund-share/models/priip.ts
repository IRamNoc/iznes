import {FormItem, FormItemType} from '@setl/core-dynamic-forms/DynamicForm';

export class SharePRIIPOptional {
    hasCreditRisk: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Credit Risk',
        required: false
    }
    creditRiskMeasure: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Credit Risk Measure ',
        required: false,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' },
            { id: '5', text: '5' },
            { id: '6', text: '6' }
        ]
    }
    marketRiskMeasure: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Market Risk Measure – MRM',
        required: false,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' },
            { id: '5', text: '5' },
            { id: '6', text: '6' },
            { id: '7', text: '7' }
        ]
    }
    liquidityRisk: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Liquidity Risk',
        required: false,
        listItems: [
            { id: 'M', text: 'M' },
            { id: 'I', text: 'I' },
            { id: 'L', text: 'L' }
        ]
    }
    summaryRiskIndicator: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Summary Risk Indicator',
        required: false,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' },
            { id: '5', text: '5' },
            { id: '6', text: '6' },
            { id: '7', text: '7' }
        ]
    }
    possibleMaximumLoss: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Possible Maximum Loss',
        required: false
    }
    recommendedHoldingPeriod: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Recommended Holding Period',
        required: false
    }
    maturityDate: FormItem = {
        type: FormItemType.date,
        label: 'Maturity Date',
        required: false
    }
    referenceDate: FormItem = {
        type: FormItemType.date,
        label: 'PRIIP Reference Date',
        required: false
    }
    category: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Category',
        required: false,
        listItems: [
            { id: '1', text: '1' },
            { id: '2', text: '2' },
            { id: '3', text: '3' },
            { id: '4', text: '4' }
        ]
    }
    numberOfObservedReturns: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Number Of Observed Returns',
        required: false
    }
    meanReturn: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Mean Return',
        required: false
    }
    volatilityOfStressedScenario: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Volatility Of Stressed Scenario',
        required: false
    }
    sigma: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Sigma',
        required: false
    }
    skewness: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Skewness',
        required: false
    }
    excessKurtosis: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP MRM Excess Kurtosis',
        required: false
    }
    vev: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV',
        required: false
    }
    isPRIIPFlexible: FormItem = {
        type: FormItemType.boolean,
        label: 'Is PRIIP Flexible',
        required: false
    }
    vev1: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV-1',
        required: false
    }
    vev2: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV-2',
        required: false
    }
    vev3: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP VEV-3',
        required: false
    }
    lumpSumOrRegularPremiumIndicator: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Lump Sum Or Regular Premium Indicator',
        required: false
    }
    investmentAmount: FormItem = {
        type: FormItemType.list,
        label: 'PRIIP Investment Amount',
        required: false,
        listItems: [
            { id: '1000', text: '1000' },
            { id: '10000', text: '10000' },
            { id: '50000', text: '50000' },
            { id: '100000', text: '100000' },
            { id: '200000', text: '200000' },
            { id: '1000000', text: '1000000' }
        ]
    }
    return1YStressScenario: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Return 1Y Stress Scenario',
        required: false
    } // 1
    return1YUnfavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return 1Y Unfavourable',
        required: false
    } // 1
    return1YModerate: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return 1Y Moderate',
        required: false
    } // 1
    return1YFavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return 1Y Favourable',
        required: false
    } // 1
    halfRHPStressScenario: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Return Half RHP Stress Scenario',
        required: false
    } // 1
    halfRHPUnfavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return Half RHP Unfavourable',
        required: false
    } // 1
    halfRHPModerate: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return Half RHP Moderate',
        required: false
    } // 1
    halfRHPFavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return Half RHP Favourable',
        required: false
    } // 1
    rhpStressScenario: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Return RHP Stress Scenario',
        required: false
    } // 1
    rhpUnfavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return RHP Unfavourable',
        required: false
    } // 1
    rhpModerate: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return RHP Moderate',
        required: false
    } // 1
    rhpFavourable: FormItem = {
        type: FormItemType.boolean,
        label: 'PRIIP Return RHP Favourable',
        required: false
    } // 1
    bondWeight: FormItem = {
        type: FormItemType.number,
        label: 'Bond Weight',
        required: false
    } // 1
    annualizedVolatility: FormItem = {
        type: FormItemType.number,
        label: 'Annualized Volatility',
        required: false
    } // 1
    macaulayDuration: FormItem = {
        type: FormItemType.number,
        label: 'Macaulay Duration',
        required: false
    } // 1
    targetMarketRetailInvestorType: FormItem = {
        type: FormItemType.number,
        label: 'Target Market Retail Investor Type',
        required: false
    } // 1
    otherRiskNarrative: FormItem = {
        type: FormItemType.number,
        label: 'PRIIP Other Risk Narrative',
        required: false
    } // 1
    hasCapitalGuarantee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has PRIIP Capital Guarantee',
        required: false
    }
    characteristics: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Characteristics',
        required: false
    } // 1
    level: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Level',
        required: false
    } // 1
    limitations: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Limitations',
        required: false
    } // 1
    earlyExitConditions: FormItem = {
        type: FormItemType.text,
        label: 'PRIIP Capital Guarantee Early Exit Conditions',
        required: false
    } // 1
}