/* import { FundShare } from './model';
import { FundShareTradeCycleModel } from './form/trade-cycle/model';

describe('FundShareModel', () => {

    let fundShareModel;
    let subFundShareTradeCycleModel;
    let redFundShareTradeCycleModel;

    beforeEach(() => {
        fundShareModel = new FundShare();
        subFundShareTradeCycleModel = new FundShareTradeCycleModel();
        subFundShareTradeCycleModel.addMonthlyDealingDays();
        subFundShareTradeCycleModel.addYearlyDealingDays();
        redFundShareTradeCycleModel = new FundShareTradeCycleModel();
        redFundShareTradeCycleModel.addMonthlyDealingDays();
        redFundShareTradeCycleModel.addYearlyDealingDays();
        fundShareModel.calendar.subscriptionTradeCycle = subFundShareTradeCycleModel;
        fundShareModel.calendar.redemptionTradeCycle = redFundShareTradeCycleModel;
    });

    describe('disableAllShareFields', () => {

        it('should set disabled properties of calendar to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.calendar.mandatory).forEach((field) => {
                expect(fundShareModel.calendar.mandatory[field].disabled).toEqual(true);
                expect(fundShareModel.calendar.mandatory[field].required).toEqual(false);
            });
        });

        it('should set disabled properties of characteristic to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.characteristic).forEach((subKey) => {
                Object.keys(fundShareModel.characteristic[subKey]).forEach((field) => {
                    expect(fundShareModel.characteristic[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.characteristic[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of fees to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.fees).forEach((subKey) => {
                Object.keys(fundShareModel.fees[subKey]).forEach((field) => {
                    expect(fundShareModel.fees[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.fees[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of keyFacts to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.keyFacts).forEach((subKey) => {
                Object.keys(fundShareModel.keyFacts[subKey]).forEach((field) => {
                    expect(fundShareModel.keyFacts[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.keyFacts[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of listing to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.listing).forEach((subKey) => {
                Object.keys(fundShareModel.listing[subKey]).forEach((field) => {
                    expect(fundShareModel.listing[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.listing[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of priip to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.priip).forEach((subKey) => {
                Object.keys(fundShareModel.priip[subKey]).forEach((field) => {
                    expect(fundShareModel.priip[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.priip[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of profile to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.profile).forEach((subKey) => {
                Object.keys(fundShareModel.profile[subKey]).forEach((field) => {
                    expect(fundShareModel.profile[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.profile[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of representation to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.representation).forEach((subKey) => {
                Object.keys(fundShareModel.representation[subKey]).forEach((field) => {
                    expect(fundShareModel.representation[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.representation[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of solvency to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.solvency).forEach((subKey) => {
                Object.keys(fundShareModel.solvency[subKey]).forEach((field) => {
                    expect(fundShareModel.solvency[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.solvency[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of taxation to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.taxation).forEach((subKey) => {
                Object.keys(fundShareModel.taxation[subKey]).forEach((field) => {
                    expect(fundShareModel.taxation[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.taxation[subKey][field].required).toEqual(false);
                });
            });
        });

        it('should set disabled properties of documents to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.documents).forEach((subKey) => {
                Object.keys(fundShareModel.documents[subKey]).forEach((field) => {
                    expect(fundShareModel.documents[subKey][field].disabled).toEqual(true);
                    expect(fundShareModel.documents[subKey][field].required).toEqual(false);
                });
            });
        });
    });
});
 */