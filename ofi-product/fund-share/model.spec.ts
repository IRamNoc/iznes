import { FundShare } from './model';
import {FileService} from "@setl/core-req-services";
import {ToasterService} from "angular2-toaster";
import {NgRedux} from "@angular-redux/store";
import {DynamicFormService} from "@setl/utils/components/dynamic-forms";

describe('FundShareModel', () => {

    let fundShareModel;

    beforeEach(() => {

        const fakeDyamicFormService = new DynamicFormService({} as FileService, {} as ToasterService, {} as NgRedux<any>);
        fundShareModel = new FundShare(fakeDyamicFormService);
    });

    describe('disableAllShareFields', () => {

        it('should set disabled properties of calendar to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.calendarSubscription.mandatory).forEach((field) => {
                if (typeof fundShareModel.calendarSubscription.mandatory[field].control !== 'undefined') {
                    expect(fundShareModel.calendarSubscription.mandatory[field].control.disabled).toEqual(true);
                    expect(fundShareModel.calendarSubscription.mandatory[field].required).toEqual(false);
                }
            });

            Object.keys(fundShareModel.calendarRedemption.mandatory).forEach((field) => {
                if (typeof fundShareModel.calendarRedemption.mandatory[field].control !== 'undefined') {
                    expect(fundShareModel.calendarRedemption.mandatory[field].control.disabled).toEqual(true);
                    expect(fundShareModel.calendarRedemption.mandatory[field].required).toEqual(false);
                }
            });
        });

        it('should set disabled properties of characteristic to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.characteristic).forEach((subKey) => {
                Object.keys(fundShareModel.characteristic[subKey]).forEach((field) => {
                    if (typeof fundShareModel.characteristic[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.characteristic[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.characteristic[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of fees to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.fees).forEach((subKey) => {
                Object.keys(fundShareModel.fees[subKey]).forEach((field) => {
                    if (typeof fundShareModel.fees[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.fees[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.fees[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of keyFacts to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.keyFacts).forEach((subKey) => {
                Object.keys(fundShareModel.keyFacts[subKey]).forEach((field) => {
                    if (typeof fundShareModel.keyFacts[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.keyFacts[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.keyFacts[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of listing to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.listing).forEach((subKey) => {
                Object.keys(fundShareModel.listing[subKey]).forEach((field) => {
                    if (typeof fundShareModel.listing[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.listing[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.listing[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of priip to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.priip).forEach((subKey) => {
                Object.keys(fundShareModel.priip[subKey]).forEach((field) => {
                    if (typeof fundShareModel.priip[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.priip[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.priip[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of profile to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.profile).forEach((subKey) => {
                Object.keys(fundShareModel.profile[subKey]).forEach((field) => {
                    if (typeof fundShareModel.profile[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.profile[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.profile[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of representation to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.representation).forEach((subKey) => {
                Object.keys(fundShareModel.representation[subKey]).forEach((field) => {
                    if (typeof fundShareModel.representation[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.representation[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.representation[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of solvency to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.solvency).forEach((subKey) => {
                Object.keys(fundShareModel.solvency[subKey]).forEach((field) => {
                    if (typeof fundShareModel.solvency[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.solvency[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.solvency[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of taxation to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.taxation).forEach((subKey) => {
                Object.keys(fundShareModel.taxation[subKey]).forEach((field) => {
                    if (typeof fundShareModel.taxation[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.taxation[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.taxation[subKey][field].required).toEqual(false);
                    }
                });
            });
        });

        it('should set disabled properties of documents to true', () => {
            fundShareModel.disableAllShareFields();

            Object.keys(fundShareModel.documents).forEach((subKey) => {
                Object.keys(fundShareModel.documents[subKey]).forEach((field) => {
                    if (typeof fundShareModel.documents[subKey][field].control !== 'undefined') {
                        expect(fundShareModel.documents[subKey][field].control.disabled).toEqual(true);
                        expect(fundShareModel.documents[subKey][field].required).toEqual(false);
                    }
                });
            });
        });
    });
});
