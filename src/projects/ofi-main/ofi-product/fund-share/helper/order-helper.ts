import { CalendarHelper } from './calendar-helper';
import { OrderType, OrderByType } from '../../../ofi-orders/order.model';
import * as moment from 'moment-business-days';
import { get, sumBy } from 'lodash';
import {
    calFee,
    getRandom8Hex,
    pad,
    toNormalScale,
    calNetAmount,
    getAmountTwoDecimal,
    calculateFigures, convertToBlockChainNumber,
} from './order-calculations';

// ** please don't remove this below commented import please,
// as i use it for building the compiled version
// import {BlockchainContractService} from '../../../../utils/services/blockchain-contract/service'; //compile
import { BlockchainContractService } from '@setl/utils/services/blockchain-contract/service'; //notcompile
import {
    Contract,
    ContractData,
    ArrangementData,
    ArrangementActionType,
    ConditionType,

    // ** please don't remove this below commented import please,
    // as i use it for building the compiled version
//} from '../../../../utils/services/blockchain-contract/model'; //compile
} from '@setl/utils/services/blockchain-contract/model'; //notcompile

//import { fixToDecimal } from '../../../../utils/helper/common/math-helper'; //compile
import { fixToDecimal } from '@setl/utils/helper/common/math-helper'; //notcompile

import { Base64 } from './base64';
import {
    BlockchainNumberDecimal,
    NormalNumberDecimal,
    NumberMultiplier,
    ExpirySecond,
    orderSettlementThreshold,
} from './config';

import {
    OrderRequest,
    IznShareDetailWithNav,
    VerifyResponse,
    OrderDates,
    OrderFigures,
    OrderTimeStamps,
    OrderPrices,
    OrderRequestBody,
    UpdateOrderResponse,
    ContractRequestBody,
    OrderTypeNumber,
    orderTypeToString,
    OrderByNumber,
    InvestorBalances,
    ShareRegistrationCertificateEmailPayload, NavData, fundClassifications,
} from './models';
import {NavStatus} from "../../../ofi-req-services/ofi-product/nav/model";

const AuthoriseRef = 'Confirm payment sent';

export class OrderHelper {
    calendarHelper: CalendarHelper;
    orderRequest: OrderRequest;
    fundShare: IznShareDetailWithNav;
    dateValue: any;
    orderType: number;
    orderBy: number;
    orderValue: number;
    orderAsset: string;
    amIssuingAddress: string;
    amWalletId: number;
    investorAddress: string;
    investorWalletId: number;
    minInitialSubscriptionInAmount: number;
    minInitialSubscriptionInShare: number;
    minSubsequentSubscriptionInAmount: number;
    minSubsequentSubscriptionInShare: number;
    minSubsequentRedemptionInAmount: number;
    minSubsequentRedemptionInShare: number;

    // used for testing, when validation is turned off
    fakeCuoff: any;
    fakeValuation: any;
    fakeSettlement: any;

    // unique references for this order helper instance
    encumberRef: string;
    poaRef: string;

    private currentNav: NavData;

    get nav() {
       if (typeof this.currentNav === 'undefined') {
          throw new Error('NAV is not set, after order helper instance is setup, nav must be set.');
       }
       const orderNavDate = (this.getOrderDates() as OrderDates).valuation;
       if (moment(this.currentNav.date, 'YYYY-MM-DD HH:mm').isAfter(orderNavDate)) {
            throw new Error('NAV date is greater than order\'s valuation date.');
       }
       return this.currentNav;
    }

    set nav(d: NavData) {
       this.currentNav = d;
    }


    get feePercentage() {
        return (this.isSellBuy && this.isAllowSellBuy) ?
            0 :
            Number({
                [OrderType.Subscription]: this.fundShare.entryFee || 0,
                [OrderType.Redemption]: this.fundShare.exitFee || 0,
            }[this.orderType]);
    }

    get currency() {
        return Number({
            [OrderType.Subscription]: this.fundShare.shareClassCurrency || 0,
            [OrderType.Redemption]: this.fundShare.redemptionCurrency || 0,
        }[this.orderType]);
    }

    get initialMinFig() {
        return ({
            [OrderType.Subscription]: {
                [OrderByType.Amount]: (this.fundShare.minInitialSubscriptionInAmount || 0),
                [OrderByType.Quantity]: (this.fundShare.minInitialSubscriptionInShare || 0),
            },
        }[this.orderType] || {})[this.orderBy] || 0;
    }

    get disableValidation(): Boolean {
        return Number(this.fundShare.isProduction) === 0;
    }

    get subsequentMinFig() {

        return OrderHelper.getSubsequentMinFig(this.fundShare, this.orderType, this.orderBy);
    }

    get orderAllowCategory() {
        return Number({
            [OrderType.Subscription]: this.fundShare.subscriptionCategory || 0,
            [OrderType.Redemption]: this.fundShare.redemptionCategory || 0,
        }[this.orderType]);
    }

    get isSellBuy(): boolean {
        return this.orderRequest.ordertype === 'sb' || this.orderRequest.issellbuy;
    }

    get isAllowSellBuy(): boolean {
        const isAllowSellBuy = this.fundShare.allowSellBuy;
        return Number(isAllowSellBuy) === 1;
    }

    constructor(fundShare: IznShareDetailWithNav, orderRequest: OrderRequest) {
        this.calendarHelper = new CalendarHelper(fundShare);
        this.orderRequest = orderRequest;
        this.fundShare = fundShare;

        this.dateValue = moment(orderRequest.datevalue, 'YYYY-MM-DD HH:mm');
        this.orderType = OrderTypeNumber[orderRequest.ordertype];
        this.orderBy = OrderByNumber[orderRequest.orderby];
        this.orderValue = Number(orderRequest.ordervalue);
        this.orderAsset = fundShare.isin + '|' + fundShare.fundShareName;
        this.amIssuingAddress = fundShare.amAddress;
        this.amWalletId = fundShare.amWalletID;
        this.investorAddress = orderRequest.subportfolio;
        this.investorWalletId = Number(orderRequest.portfolioid);

        // set the unique reference
        const randomHex = getRandom8Hex();
        this.setEncumberReference(randomHex);
        this.setPoaReference();

        this.fakeCuoff = moment().add(30, 'seconds');
        this.fakeValuation = this.fakeCuoff.clone().utc().set({ hour: 0, minute: 0, second: 1 });
        this.fakeSettlement = moment().add(45, 'seconds');

    }

    static getChildErrorMessage(response) {
        return {
            orderValid: false,
            errorMessage: response.errorMessage,
        };
    }

    static isResponseGood(response: VerifyResponse): boolean {
        return !('orderValid' in response) || response.orderValid;
    }

    /**
     *
     * @param walletId
     * @param ref
     * @param fromAddress: benificiary/administrator address
     * @param toAddress: asset owner address
     * @param namespace
     * @param instrument
     * @param amount
     * @param {string} protocol
     * @param {string} metadata
     * @return {{messagetype: string; messagebody: {txtype: string; walletid: any; reference: any; address: any; subjectaddress: any; namespace: any; instrument: any; amount: any; protocol: string | undefined; metadata: string | undefined}}}
     */
    static buildUnencumberRequestBody(walletId: number, ref: string, fromAddress: string, toAddress: string, namespace: string, instrument: string, amount: number, protocol = '', metadata = '') {
        return {
            messagetype: 'tx',
            messagebody: {
                txtype: 'unenc',
                walletid: walletId,
                reference: ref,
                address: fromAddress,
                subjectaddress: toAddress,
                namespace,
                instrument,
                amount,
                protocol,
                metadata,
            },
        };
    }

    /**
     * build cancel contract request body
     * @param fundShareData
     * @param orderType
     * @param orderByType
     * @return {any | number}
     */

    static buildCancelContract(walletId: number, contractAddress: string, commitAddress: string) {
        const contractData = BlockchainContractService
            .buildCancelContractMessageBody(contractAddress, commitAddress).contractdata;

        return {
            messagetype: 'tx',
            messagebody: {
                topic: 'cocom',
                walletid: walletId,
                address: commitAddress,
                function: 'dvp_uk_commit',
                contractdata: contractData,
                contractaddress: contractAddress,
            },
        };
    }

    static getSubsequentMinFig(fundShareData, orderType, orderByType) {
        return ({
            [OrderType.Subscription]: {
                [OrderByType.Amount]: (fundShareData.minSubsequentSubscriptionInAmount || 0),
                [OrderByType.Quantity]: (fundShareData.minSubsequentSubscriptionInShare || 0),
            },
            [OrderType.Redemption]: {
                [OrderByType.Amount]: (fundShareData.minSubsequentRedemptionInAmount || 0),
                [OrderByType.Quantity]: (fundShareData.minSubsequentRedemptionInShare || 0),
            },
        }[orderType] || {})[orderByType] || 0;
    }

    static buildOrderReleaseShareRequestBody(order: UpdateOrderResponse) {
        const walletId = order.amWalletID;
        const ref = order.uniqueRef;
        const fromAddress = order.amAddress;
        const toAddress = order.investorAddress;
        const namespace = order.isin;
        const instrument = order.fundShareName;
        const amount = order.quantity;

        return OrderHelper.buildUnencumberRequestBody(
            walletId,
            ref,
            fromAddress,
            toAddress,
            namespace,
            instrument,
            amount,
        );
    }

    static buildOrderSendSharePdfRequestBody(order: ShareRegistrationCertificateEmailPayload, holding: number) {
        const decimalPlaces = 5;
        const orderReference = pad(order.orderID, 11, '0');
        const orderType = Number(order.orderType);
        let subject;

        if (orderType === OrderType.Subscription) {
            subject = 'Certification of Book Entry - SUBSCRIPTION ' + orderReference;
        } else {
            subject = 'Certification of Book Entry - REDEMPTION ' + orderReference;
        }

        const generalBody = subject;

        const todayStr = moment().utc().format('YYYY-MM-DD');
        const amCompanyShareCapital = order.amCompanyShareCapital
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

        const actionJson = {
            type: 'sendPdf',
            data: {
                pdfType: 'share',
                pdfMetadata: {
                    fundName: order.fundShareName,
                    isinCode: order.isin,
                    fundsForm: 'Fonds commun de placement',
                    nationality: 'Français',
                    clientName: order.investorWalletName, // Customer Wallet Name
                    subportfolioName: order.subportfolioName,
                    listDate: todayStr,
                    reference: orderReference,
                    clientReference: order.clientReference,
                    date: todayStr,
                    numberOfShares: toNormalScale(Number(holding), 5),
                    amCompanyName: order.amCompanyName,
                    amCompanyLegalForm: order.amCompanyLegalForm,
                    amCompanyShareCapital,
                    amCompanyAddressLine1: order.amCompanyAddressLine1,
                    amCompanyAddressLine2: order.amCompanyAddressLine2,
                    amCompanyZipcode: order.amCompanyZipcode,
                    amCompanyCity: order.amCompanyCity,
                    amCompanyCountry: order.amCompanyCountry,
                    amCompanyRcsMatriculation: order.amCompanyRcsMatriculation,
                    amCompanyWebsiteUrl: order.amCompanyWebsiteUrl,
                    amCompanyPhoneNumber: order.amCompanyPhoneNumber,
                    setl_db_b64_amCompanyLogo: {
                        query: 'call s2_iznMnGetMcImage(?, ?)',
                        params: {
                            type: 'logo',
                            mcId: order.amCompanyID,
                        },
                        defaults: {
                            type: 'string',
                            mcId: 'number',
                        }
                    },
                    setl_db_b64_amCompanySignature: {
                        query: 'call s2_iznMnGetMcImage(?, ?)',
                        params: {
                            type: 'signature',
                            mcId: order.amCompanyID,
                        },
                        defaults: {
                            type: 'string',
                            mcId: 'number',
                        }
                    }
                },
            },
        };

        const hasAction = true;

        return OrderHelper.buildSendMessage(
            subject, generalBody, actionJson, order.amWalletID,
            order.amComPub, [order.investorAddress, order.amAddress], hasAction,
        );
    }

    static buildSendMessage(
        subject: string,
        mailGeneralContent: string,
        mailActionJson: any,
        senderWalletId: number,
        senderPub: string,
        recipientWalletAddresses: string[],
        hasAction: boolean,
    ) {

        const mailBody = JSON.stringify({
            general: Base64.encode(mailGeneralContent),
            action: mailActionJson,
        });

        const recipients = OrderHelper.buildAddressRecipients(recipientWalletAddresses);

        return {
            mailSubject: Base64.encode(subject),
            mailBody,
            senderId: senderWalletId,
            senderPub,
            recipients,
            parentId: 0,
            arrangementId: 0,
            arrangementStatus: 0,
            attachment: 0,
            hasAction,
            isDraft: 0,
        };
    }

    static buildAddressRecipients(addresses: string[]): { [address: string]: 0 } {
        return addresses.reduce(
            (result, item, index) => {
                result[item] = 0;
                return result;
            },
            {},
        );
    }

    static getAddressFreeBalanceFromHolderResponse(response: any, address: string): number {
        const encumbrances = get(response, ['data', 'encumbrances'], {});
        const holders = get(response, ['data', 'holders'], {});

        const totalHolding: number = get(holders, [address], 0);
        const encumbered: number = get(encumbrances, [address], 0);

        return totalHolding - encumbered;
    }

    static getAddressBalancesFromHolderResponse(response: any, address: string): InvestorBalances {
        const encumbrances = get(response, ['data', 'encumbrances'], {});
        const holders = get(response, ['data', 'holders'], {});

        const totalHolding: number = get(holders, [address], 0);
        const encumbered: number = get(encumbrances, [address], 0);

        return {
            investorTotalHolding: totalHolding,
            investorTotalEncumber: encumbered,
        };
    }

    static getInvestorRedemptionTotalEcumbrance(encumbranceDetail: any, address: string, isin: string, shareName: string) {
        const encumbrancesArr = get(encumbranceDetail, ['data', address, isin, shareName], []);

        // As all the redemption encumbrance, would start with the order type 4 (hopefully), so we just get all the
        // encumbrance that with reference start with 4.
        const redemptionEncuArr = encumbrancesArr.filter(encum => get(encum, 'reference', '')[0] === '4');

        // return the sum
        return sumBy(redemptionEncuArr, 'amount');
    }

    static buildRequestInvestorHoldingRequestBody(order: UpdateOrderResponse | IznShareDetailWithNav) {
        const walletId = order.amWalletID;
        const namespace = order.isin;
        const instrument = order.fundShareName;

        return {
            messagetype: 'request',
            messagebody: {
                topic: 'holders',
                walletid: walletId,
                namespace,
                instrument,
            },
        };
    }

    /**
     * Build redemption's authorisation commit request body
     *
     * @param {UpdateOrderResponse} order
     * @return {{
     *  messagetype: string;
     *  messagebody: {txtype: string; walletid: number; address: string; function: string; contractdata: {contractfunction: string; issuingaddress: string; contractaddress: string; party: any[]; commitment: any[]; receive: any[]; authorise: string[][]}; contractaddress: string}}}
     */
    static buildRedeemAuthorisationCommitReqeustBody(order: UpdateOrderResponse) {
        const authMsg = {
            type: 'authorisor',
            msg: AuthoriseRef,
            address: order.amAddress,
        };

        const contractData = {
            contractfunction: 'dvp_uk_commit',
            issuingaddress: order.amAddress,
            contractaddress: order.contractAddr,
            party: [],
            commitment: [],
            receive: [],
            authorise: [
                [order.amAddress, '0', '', JSON.stringify(authMsg), false],
            ],
        };

        const messageBody = {
            txtype: 'cocom',
            walletid: order.amWalletID,
            address: order.amAddress,
            function: 'dvp_uk_commit',
            contractdata: contractData,
            contractaddress: order.contractAddr,
        };

        return {
            messagetype: 'tx',
            messagebody: messageBody,
        };
    }

    /**
     * Check if we have any redemption order that is not settled.
     * We do the check, by using the amount of encumber in the address.
     *
     * @param {number} totalRedemptionEncumber
     * @return {boolean}
     */
    static isOnlyActiveRedeem(totalRedemptionEncumber: number): boolean {
        return Number(totalRedemptionEncumber) === 0;
    }

    /**
     *
     we have the following:
     - total balance in the blockchain
     - total encumber in the blockchain (subscription encumbered + redemption encumbered)
     - total encumbered amount for the address (might get from walletnode now ?)

     - true free amount = total balance in the blockchain - total encumbered in the blockchain
     - redemption encumbered amount = get from the blockchain (using encumber reference to find out)
     - total amount (not including subscription encumbered) = free balance in the blockchain + redeption encumbered

     if the redemption encumbered amount is zero
     we will check the order value is greater than 80 % of the total free amount

     if the redemption encumbered amount is not zero
     total 80% = we work out the 80% total amount(not including subscription encumbred)
     remaining 80% = total 80% - redemption encumbered amount
     check if the order value is greater than the remaining 80%
     *
     * @param {number} orderValue
     * @param {number} totalBalance
     * @param {number} totalEncumber
     * @param totalRedemptionEncumber
     * @param {number} price
     * @return {VerifyResponse}
     *
     */
    static isRedeemOver80Percent(orderValue: number, totalBalance: number, totalEncumber: number, totalRedemptionEncumber, price: number): VerifyResponse {
        // we have two scenarios to check:
        // 1. we don't have any active redemption order, so we just check the order value is <= 80% of total free holding.
        // 2. we got acitve redemption order(s):
        // total 80% = we work out the 80% total amount(not including subscription encumbred)
        // remaining 80% = total 80% - redemption encumbered amount
        // check if the order value is greater than the remaining 80%

        // total free amount
        const freeAmount = fixToDecimal(totalBalance - totalEncumber, 0, 'floor');

        // Get total amount excluding encumber from subscription.
        const totalAmountExSub = fixToDecimal(freeAmount + totalRedemptionEncumber, 0, 'floor');
        const amount80Percent = fixToDecimal(totalAmountExSub * 0.8, 0, 'floor');

        if (OrderHelper.isOnlyActiveRedeem(totalRedemptionEncumber)) {

            // multiply by price because we look at the money value
            if (orderValue <= fixToDecimal(amount80Percent * price / NumberMultiplier, 0, 'floor')) {
                return {
                    orderValid: true,
                };
            } else {
                return {
                    orderValid: false,
                    errorMessage: 'Order value over 80%, try to redeem by quantity',
                };
            }
        } else {
            // the amount remain from the 80%
            // multiply by price because we look at the money value
            const remaingFrom80Percent = amount80Percent - totalRedemptionEncumber;
            if (orderValue <= fixToDecimal(remaingFrom80Percent * price / NumberMultiplier, 0, 'floor')) {
                return {
                    orderValid: true,
                };
            } else {
                return {
                    orderValid: false,
                    errorMessage: 'Order value over 80%, try to redeem by quantity, or cancel the previous redemption order.',
                };
            }
        }
    }

    buildContractData(): VerifyResponse | ContractData {

        let arrangementData;

        // check if nav for the share is exist
        const navCheck = this.checkShareNavIsValid();
        if (!OrderHelper.isResponseGood(navCheck)) {
            return OrderHelper.getChildErrorMessage(navCheck);
        }

        // check if fund access for the share is exist
        const shareAccessCheck = this.checkHasShareAccess();
        if (!OrderHelper.isResponseGood(shareAccessCheck)) {
            return OrderHelper.getChildErrorMessage(shareAccessCheck);
        }

        if (this.orderType === OrderType.Subscription) {
            arrangementData = this.buildSubscriptionArrangementData();
        } else if (this.orderType === OrderType.Redemption) {
            arrangementData = this.buildRedemptionArrangementData();
        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid order type.',
            };
        }

        if (!OrderHelper.isResponseGood(arrangementData)) {
            return OrderHelper.getChildErrorMessage(arrangementData);
        }
        let contractData = BlockchainContractService.arrangementToContractData(arrangementData as ArrangementData);
        if (!OrderHelper.isResponseGood(arrangementData)) {
            return OrderHelper.getChildErrorMessage(contractData);
        }
        contractData = contractData as Contract;

        return contractData.contractData;
    }

    buildOrderRequestBody(): VerifyResponse | OrderRequestBody {
        const investorAddress = this.investorAddress;
        const amCompanyID = this.fundShare.amCompanyID;
        const amWalletID = this.fundShare.amWalletID;
        const amAddress = this.amIssuingAddress;
        const orderStatus = 1;
        const currency = this.currency;
        const fundShareID = this.fundShare.fundShareID;
        const byAmountOrQuantity = this.orderBy;
        const estimatedPrice = this.nav.value;
        let orderFigure = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderFigure as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderFigure);
        }
        orderFigure = orderFigure as OrderFigures;

        const quantity = orderFigure.quantity;
        const estimatedQuantity = orderFigure.estimatedQuantity;
        const amount = orderFigure.amount;
        const estimatedAmount = orderFigure.estimatedAmount;
        const amountWithCost = orderFigure.amountWithCost;
        const estimatedAmountWithCost = orderFigure.estimatedAmountWithCost;
        const price = orderFigure.validatedPrice;
        const feePercentage = this.feePercentage;
        const platFormFee = this.fundShare.platFormFee || 0;
        const classificationFee = getFundClassificationFee((this.fundShare.fundClassificationId ) || 1);

        let orderDates = this.getOrderDates();
        if (!OrderHelper.isResponseGood(orderDates as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDates);
        }
        orderDates = orderDates as OrderDates;

        const cutoffDate = orderDates.cutoff.utc().format('YYYY-MM-DD HH:mm');
        const valuationDate = orderDates.valuation.utc().format('YYYY-MM-DD HH:mm');
        const settlementDate = orderDates.settlement.utc().format('YYYY-MM-DD HH:mm');

        const orderNote = this.orderRequest.comment;

        const orderTimeStamps = this.getOrderTimeStamp();

        const contractExpiryTs = orderTimeStamps.expiryTimeStamp;
        const contractStartTs = orderTimeStamps.settleTimeStamp;

        const uniqueRef = this.encumberRef;
        const isKnownNav = this.isKnownNav() ? 1 : 0;

        return {
            investorAddress,
            amCompanyID,
            amWalletID,
            amAddress,
            orderStatus,
            currency,
            fundShareID,
            byAmountOrQuantity,
            price,
            estimatedPrice,
            quantity,
            estimatedQuantity,
            amount,
            estimatedAmount,
            amountWithCost,
            estimatedAmountWithCost,
            feePercentage,
            platFormFee,
            classificationFee,
            cutoffDate,
            valuationDate,
            settlementDate,
            orderNote,
            contractExpiryTs,
            contractStartTs,
            uniqueRef,
            isKnownNav,
        };
    }

    buildContractRequestBody(): VerifyResponse | ContractRequestBody {
        const contractData = this.buildContractData();
        if (!OrderHelper.isResponseGood(contractData as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(contractData);
        }
        const walletid = this.amWalletId;
        const address = this.amIssuingAddress;
        return {
            messagetype: 'tx',
            messagebody: {
                txtype: 'conew',
                walletid,
                address,
                contractdata: contractData as any,
            },
        };
    }

    getFakeDatesString() {
        try {
            const [fakeCutoffStr, fakeValuationStr, fakeSettelmentStr] = this.orderRequest.datevalue.split(';');

            const validFakeCutoffStr = moment.utc(fakeCutoffStr, 'YYYY-MM-DD HH:mm').isValid();
            const validFakeValuationStr = moment.utc(fakeValuationStr, 'YYYY-MM-DD HH:mm').isValid();
            const validFakeSettelmentStr = moment.utc(fakeSettelmentStr, 'YYYY-MM-DD HH:mm').isValid();

            if (validFakeCutoffStr && validFakeValuationStr && validFakeSettelmentStr) {
                return {
                    cutoff: moment.utc(fakeCutoffStr, 'YYYY-MM-DD HH:mm'),
                    valuation: moment.utc(fakeValuationStr, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 1 }),
                    settlement: moment.utc(fakeSettelmentStr, 'YYYY-MM-DD HH:mm'),
                };
            }
            return {
                cutoff: this.fakeCuoff,
                valuation: this.fakeValuation,
                settlement: this.fakeSettlement,
            };

        } catch (e) {
            return {
                cutoff: this.fakeCuoff,
                valuation: this.fakeValuation,
                settlement: this.fakeSettlement,
            };
        }
    }

    getOrderDates(): VerifyResponse | OrderDates {
        // the logic is for testing purpose, it will disable all the validation
        if (this.disableValidation) {
            return this.getFakeDatesString();
        }

        // depend on order by cutoff, valuation, and settlement date.
        let dateValid = false;
        let cutoff;
        let valuation;
        let settlement;

        switch (this.orderRequest.dateby) {
            case 'cutoff':
                dateValid = this.calendarHelper.isValidCutoffDateTime(this.dateValue, this.orderType);
                if (!dateValid) {
                    return {
                        orderValid: false,
                        errorMessage: 'Invalid date',
                    };
                }

                cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(this.dateValue, this.orderType);
                valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
                settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

                break;
                
            case 'automatic':
                var currentDate = moment.utc(new Date(), 'YYYY-MM-DD HH:mm');
                var currentRetry = 0;
                var maxRetries = 30;

                for (currentRetry; currentRetry < maxRetries; currentRetry++) {
                    dateValid = this.calendarHelper.isValidCutoffDateTime(currentDate, this.orderType);
                    if (dateValid) {
                        cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(currentDate, this.orderType);
                        valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
                        settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);
                        currentRetry = maxRetries;
                    } 
                    currentDate = currentDate.add(1, 'days');
                }

                if (currentRetry >= maxRetries && !dateValid) {
                    return {
                        orderValid: false,
                        errorMessage: 'Invalid date',
                    };
                }
                break;

            case 'valuation':
                dateValid = this.calendarHelper.isValidValuationDateTime(this.dateValue, this.orderType);
                if (!dateValid) {
                    return {
                        orderValid: false,
                        errorMessage: 'Invalid date',
                    };
                }

                cutoff = this.calendarHelper.getCutoffDateFromValuation(this.dateValue, this.orderType);
                cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(cutoff, this.orderType);
                valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
                settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

                break;

            case 'settlement':
                dateValid = this.calendarHelper.isValidSettlementDateTime(this.dateValue, this.orderType);
                if (!dateValid) {
                    return {
                        orderValid: false,
                        errorMessage: 'Invalid date',
                    };
                }

                cutoff = this.calendarHelper.getCutoffDateFromSettlement(this.dateValue, this.orderType);
                cutoff = this.calendarHelper.getCutoffTimeForSpecificDate(cutoff, this.orderType);
                valuation = this.calendarHelper.getValuationDateFromCutoff(cutoff, this.orderType);
                settlement = this.calendarHelper.getSettlementDateFromCutoff(cutoff, this.orderType);

                break;

            default:
                return {
                    orderValid: false,
                    errorMessage: 'Invalid date',
                };
        }

        if (settlement.diff(moment(), 'days') > orderSettlementThreshold) {
            return {
                orderValid: false,
                errorMessage: 'Settlement date has to be within a month',
            };
        }

        return {
            cutoff,
            valuation,
            settlement,
        };
    }

    getOrderPrice(): OrderPrices {
        let price;
        let estimatedPrice;

        price = 0;
        estimatedPrice = this.nav.value;

        return {
            price,
            estimatedPrice,
        };
    }

    checkOrderValueValid(orderValueToCheck) {
        // we the order type is sell buy, we don't bother to check it.
        if (this.isSellBuy) {
            return {
                orderValid: true,
            };
        }

        // Check order value (quantity / amount) is meet requirements:
        // - [] greater than initial min order value ;
        // - [x] greater than subsequent min order value ;
        if (orderValueToCheck < this.subsequentMinFig) {
            return {
                orderValid: false,
                errorMessage: 'Order value does not meet subsequent minimum',
            };
        }

        return {
            orderValid: true,
        };
    }

    getOrderFigures(): VerifyResponse | OrderFigures {
        const checkOrderValue = this.checkOrderValueValid(this.orderValue);
        if (!OrderHelper.isResponseGood(checkOrderValue)) {
            return OrderHelper.getChildErrorMessage(checkOrderValue);
        }

        const checkAllowOrderType = this.checkOrderByIsAllow();

        if (!OrderHelper.isResponseGood(checkAllowOrderType)) {
            return OrderHelper.getChildErrorMessage(checkAllowOrderType);
        }

        try {
            const orderCalc = calculateFigures(
                {
                    feePercentage: this.feePercentage,
                    nav: this.nav.value,
                    orderBy: this.orderBy,
                    orderType: this.orderType,
                    value: this.orderValue,
                },
                +this.fundShare.maximumNumDecimal,
                this.isKnownNav(),
            );
            
            if(this.orderBy === OrderByType.Amount) {
                orderCalc.amount = this.orderValue;
            }

            return orderCalc;
        } catch (e) {
            return {
                orderValid: false,
                errorMessage: e.message,
            };
        }
    }

    getOrderTimeStamp(): OrderTimeStamps {
        const orderDate = this.getOrderDates() as OrderDates;
        const settleTimeStamp = Number(Math.floor(orderDate.settlement.valueOf() / 1000));
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;
        return {
            settleTimeStamp,
            expiryTimeStamp,
        };
    }

    checkShareNavIsValid(): VerifyResponse {

        let orderValid = true;
        let errorMessage = '';

        if (Number(this.nav.value) <= 0) {
            orderValid = false;
            errorMessage = 'Nav less than or equal 0';
        }

        return {
            orderValid,
            errorMessage,
        };
    }

    checkHasShareAccess(): VerifyResponse {
        let orderValid = true;
        let errorMessage = '';

        if (Number(this.fundShare.hasShareAccess) !== 1) {
            orderValid = false;
            errorMessage = 'Fund access is not exist';
        }

        return {
            orderValid,
            errorMessage,
        };

    }

    checkRedemptionOrderValue(orderFigures: OrderFigures): VerifyResponse {
        let orderValid = true;
        let errorMessage = '';

        if (Number(this.fundShare.investorHoling) < Math.floor(orderFigures.quantity)) {
            orderValid = false;
            errorMessage = 'Insufficient number of share to redeem.';
        }

        // check if order is over 80% and is by amount
        if (this.orderRequest.orderby === 'a') {
            const redeemOverResponse = OrderHelper.isRedeemOver80Percent(
                Number(this.orderRequest.ordervalue),
                this.fundShare.investorTotalHolding,
                this.fundShare.investorTotalEncumber,
                this.fundShare.investorRedemptionEncumber,
                this.nav.value,
            );

            if (!OrderHelper.isResponseGood(redeemOverResponse)) {
                return OrderHelper.getChildErrorMessage(redeemOverResponse);
            }
        }

        return {
            orderValid,
            errorMessage,
        };

    }

    buildSubscriptionArrangementData(): ArrangementData | VerifyResponse {
        let actionData;
        let addEncs;
        // [investorAddress, issueAsset, '', cpToEncToBank, [[bankAddress, 0, 0], [item.address, 0, 0]], []]

        let orderDate = this.getOrderDates();
        let orderFigures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderDate as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        }
        if (!OrderHelper.isResponseGood(orderFigures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderFigures);
        }
        orderDate = orderDate as OrderDates;
        orderFigures = orderFigures as OrderFigures;

        const settleTimeStamp = Number(orderDate.settlement.valueOf() / 1000);
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;

        // byType: Subscribe by quantity or by amount.
        if (this.orderBy === OrderByType.Quantity) {
            // by quantity

            actionData = [
                {
                    actionData: {
                        amount: `${orderFigures.quantity} + nav * 0`,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.amIssuingAddress,
                        toAddress: this.investorAddress,
                        metaData: {
                            clientTxType: 'subscription',
                        },
                    },
                    actionType: ArrangementActionType.ISSUE,
                },
            ];

            addEncs = [
                [
                    this.investorAddress,
                    this.orderAsset,
                    this.encumberRef,
                    orderFigures.quantity,
                    [],
                    [[this.amIssuingAddress, 0, 0]],
                ],
            ];

        } else if (this.orderBy === OrderByType.Amount) {
            // by amount
            const decimalDivider = Math.pow(10, Number(this.fundShare.maximumNumDecimal));
            // the formula before apply maximum number decimal.
            let amountStr = `(${this.orderValue} / nav) * ${NumberMultiplier}`;
            // apply maximum number decimal.
            // tslint:disable-next-line:max-line-length
            amountStr = `round(${amountStr}/${NumberMultiplier} * ${decimalDivider}) / ${decimalDivider} * ${NumberMultiplier}`;

            actionData = [
                {
                    actionData: {
                        amount: amountStr,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.amIssuingAddress,
                        toAddress: this.investorAddress,
                        metaData: {
                            clientTxType: 'subscription',
                        },
                    },
                    actionType: ArrangementActionType.ISSUE,
                },
            ];

            addEncs = [
                [this.investorAddress, this.orderAsset, this.encumberRef, amountStr,
                [], [[this.amIssuingAddress, 0, 0]]]];
        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid action-by type.',
            };
        }

        const conditions = [
            {
                conditionData: {
                    executeTimeStamp: settleTimeStamp,
                },
                conditionType: ConditionType.TIME,
            },
            // {
            //     conditionData: {
            //         authoriseRef: AuthoriseRef,
            //         address: this.amIssuingAddress
            //     },
            //     conditionType: ConditionType.AUTHORISE
            // }
        ];

        return {
            actions: actionData,
            conditions,
            datas: [
                {
                    parameter: 'nav',
                    address: this.amIssuingAddress,
                },
            ],
            addEncs,
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: 'Subscription order for ' + this.orderAsset,
            mustSigns: { [this.investorAddress]: false, [this.amIssuingAddress]: false },
            creatorAddress: 'not being used', // not being used
        };
    }

    buildRedemptionArrangementData(): ArrangementData | VerifyResponse {
        let actionData;
        const addEncs = [];

        let orderDate = this.getOrderDates();
        let orderFigures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(orderDate as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        }
        if (!OrderHelper.isResponseGood(orderFigures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(orderDate);
        }

        orderDate = orderDate as OrderDates;
        orderFigures = orderFigures as OrderFigures;

        const figureCheck = this.checkRedemptionOrderValue(orderFigures);
        if (!OrderHelper.isResponseGood(figureCheck)) {
            return OrderHelper.getChildErrorMessage(figureCheck);
        }

        const settleTimeStamp = Number(orderDate.settlement.valueOf() / 1000);
        const expiryTimeStamp = settleTimeStamp + ExpirySecond;

        // byType: Subscribe by quantity or by amount.
        if (this.orderBy === OrderByType.Quantity) {
            // by quantity

            actionData = [
                {
                    actionData: {
                        amount: `${orderFigures.quantity} + nav * 0`,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.investorAddress,
                        toAddress: this.amIssuingAddress,
                        metaData: {
                            clientTxType: 'redemption',
                        },
                    },
                    actionType: ArrangementActionType.SEND,
                },
            ];

        } else if (this.orderBy === OrderByType.Amount) {
            // by amount
            const decimalDivider = Math.pow(10, Number(this.fundShare.maximumNumDecimal));
            // the formula before apply maximum number decimal.
            let amountStr = `(${this.orderValue} / nav) * ${NumberMultiplier}`;
            // apply maximum number decimal.
            // tslint:disable-next-line:max-line-length
            amountStr = `round(${amountStr}/${NumberMultiplier} * ${decimalDivider}) / ${decimalDivider} * ${NumberMultiplier}`;

            actionData = [
                {
                    actionData: {
                        amount: amountStr,
                        amountType: 'amount',
                        asset: this.orderAsset,
                        dataItem: [],
                        fromAddress: this.investorAddress,
                        toAddress: this.amIssuingAddress,
                        metaData: {
                            clientTxType: 'redemption',
                        },
                    },
                    actionType: ArrangementActionType.SEND,
                },
            ];

        } else {
            return {
                orderValid: false,
                errorMessage: 'Invalid action-by type.',
            };
        }

        const conditions = [
            {
                conditionData: {
                    executeTimeStamp: settleTimeStamp,
                },
                conditionType: ConditionType.TIME,
            },
            {
                conditionData: {
                    authoriseRef: AuthoriseRef,
                    address: this.amIssuingAddress,
                },
                conditionType: ConditionType.AUTHORISE,
            },
        ];

        return {
            actions: actionData,
            conditions,
            datas: [
                {
                    parameter: 'nav',
                    address: this.amIssuingAddress,
                },
            ],
            addEncs,
            useEncum: [true, this.encumberRef],
            expiry: expiryTimeStamp,
            numStep: '1',
            stepTitle: 'Redemption order for ' + this.orderAsset,
            mustSigns: { [this.investorAddress]: false, [this.amIssuingAddress]: false },
            creatorAddress: 'not being used' // not being used
        };
    }

    checkOrderByIsAllow(orderType = this.orderRequest.orderby): VerifyResponse {

        // if the order type is sell buy, we don't care about the
        // 'allow by amount' and 'allow by quantity' in the characteristics.
        if (this.isSellBuy) {
            // if order type of sell buy is allow in the share.
            if (this.isAllowSellBuy) {
                return {
                    orderValid: true,
                };
            }

            // if not allow sell buy, we reject it.
            return {
                orderValid: false,
                errorMessage: 'Sell buy is not allow for the share.',
            };
        }

        const tryingToOrderBy = OrderByNumber[orderType] - 1;
        // check if order type is allow
        const typesAllow = this.orderAllowCategory;

        if (typesAllow === 2) {
            return {
                orderValid: true,
            };
        }

        if (typesAllow !== tryingToOrderBy) {
            return {
                orderValid: false,
                errorMessage: 'Not allow to order by this type',
            };
        }
        return {
            orderValid: true,
        };
    }

    /**
     * Get encumber reference
     * @param randomHex string
     */
    setEncumberReference(randomHex: string) {
        this.encumberRef = this.orderType + '-' + this.amIssuingAddress + randomHex;
    }

    /**
     * Get poa reference
     */
    setPoaReference() {
        this.poaRef = 'poa-' + this.encumberRef;
    }

    /**
     * Create Encumber request body for redemption order
     *
     * @return {any}
     */
    buildRedeemEncumberRequestBody() {
        let figures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(figures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(figures);
        }
        figures = figures as OrderFigures;

        const quantity = figures.estimatedQuantity;

        const messageBody = {
            txtype: 'encum',
            walletid: this.investorWalletId,
            reference: this.encumberRef,
            address: this.investorAddress,
            subjectaddress: this.investorAddress,
            namespace: this.fundShare.isin,
            instrument: this.fundShare.fundShareName,
            amount: quantity,
            iscumulative: true,
            beneficiaries: [[this.amIssuingAddress, 0, 0]],
            administrators: [[this.amIssuingAddress, 0, 0]],
            protocol: '',
            metadata: '',
        };

        return {
            messagetype: 'tx',
            messagebody: messageBody,
        };
    }

    /***
     * Create redemption order's poa transaction. Give am's permission to refresh the encumber amount for investor
     *
     * @return {any}
     */
    buildRedeemEncumberPoaRequestBody() {
        let figures = this.getOrderFigures();

        if (!OrderHelper.isResponseGood(figures as VerifyResponse)) {
            return OrderHelper.getChildErrorMessage(figures);
        }
        figures = figures as OrderFigures;

        const quantity = figures.estimatedQuantity;

        const messageBody = {
            txtype: 'poaad',
            walletid: this.investorWalletId,
            address: this.investorAddress,
            attorneyaddress: this.amIssuingAddress,
            permissions: [
                {
                    txtype: 'encum',
                    amount: quantity * 10,
                    assets: [
                        `${this.fundShare.isin}|${this.fundShare.fundShareName}`,
                    ],
                },
            ],
            poareference: this.poaRef,
            enddate: this.getOrderTimeStamp().expiryTimeStamp,
        };

        return {
            messagetype: 'tx',
            messagebody: messageBody,
        };
    }

    /**
     * Check the order we placing is known nav.
     * To be qualify as known nav:
     * - latest nav is same nav date of the order
     * - The nav is status is validated.
     */
    isKnownNav(): boolean {
        // get the current chosen nav date
        const orderNavDate = (this.getOrderDates() as OrderDates).valuation.format('YYYY-MM-DD');

        // get the latest nav's date
        const latestNavDate = moment(this.nav.date, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');

        // get the latest nav's status
        const latestNavStatus = this.nav.status;

        // check if latest nav's status is  validated
        // check if latest nav's date is same as the order's
        if (Number(latestNavStatus) !== NavStatus.FINAL) {
            return false;
        }

        if (orderNavDate !== latestNavDate) {
            return false;
        }

        return true;
    }

}

function getFundClassificationFee(fundClassificationId): number {
    return convertToBlockChainNumber(fundClassifications[fundClassificationId].fee);
}
