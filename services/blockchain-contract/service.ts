import {Injectable} from '@angular/core';

import {
    ArrangementData,
    ContractData,
    ArrangementActionType,
    SendActionData,
    PartiesData,
    IssueActionData,
    PartyListEntryData, PartyIdentifier, PartySignAddress, PartyListEntryPayListData, PartyListEntryReceiveListData,
    PartyPublicKey, SignContractAddress, MustSign, PayAmountData, ReceiveAmountData, PartyData, Address,
    ConditionData, ConditionType, AuthoriseConditionData, TimeConditionData, Contract, ParameterData, AuthorisationId,
    AuthorisationEntryData
} from './model';
import {immutableHelper} from '../../helper';

@Injectable()
export class BlockchainContractService {
    constructor() {

    }

    static arrangementToContractData(arrangementData: ArrangementData): Contract | boolean {
        /*
         'function' = dvp_uk :

         {
         'parties'       : [
         partyCount,
         [                     # party details :
         PartyIdentifier,
         SigAddress,
         [                  # pay list, may be an empty list.
         [
         Address,        # Address from which payment will be taken.
         NameSpace,      # Asset Issuer
         AssetID,        # Asset Class
         Qty1,           # Amount
         Public Key,     # Public Key for this Address. HEX. 64 chars.
         Signature,      # Base64. Signature of [NameSpace, AssetID, Qty] by Address1
         Issuance,       # (Bool) Issue new asset to fulfil this payment. Only works if this Payment Address
         (which MUST be specified at contract creation) is the Asset Issuance Address, otherwise causes a
         validation error.
         #        Will use an encumbranece, like other payments, when this payment / party is not signed.
         MetaData        # (String) Metadata related to this payment. Will be copied through to 'Effective' Transactions.
         ],
         ...
         ],
         [                  # receive list, may be an empty list.
         [
         Address2,       # Address to which payment will be made
         NameSpace1,     # Asset Issuer
         AssetID1,       # Asset Class
         Qty1],          # Amount
         ...
         ],
         Public Key,        # Public key of this party. If not specified, may be provided by a DVP_Commit transaction.
         Signature,         # Signature of contractAddress by SigAddress. Usually empty string, provided by a DVP_
         Commit transaction.
         MustSign           # Boolean. If True, then party must sign, otherwise 'receipt-only' parties are not required
         to sign and Encumbrances will be used without signature.
         ],
         ...
         ],
         'authorisations': [                        # A list (may be empty) of additional commitments required to
         validate the contract
         [
         publickey,            # HEX. public key, 64 chars. Alternatively you may specify an Address, in which case
         'Signature' may not be supplied, but must be provided by a Commit transaction.
         AuthorisationID       # (May be empty string),
         Signature,            # Base64. Signature of the conatenation of the ContractAddress and the AuthorisationID.
         Usually empty string, provided by subsequent commitment.
         MetaData,             # User data. May be specified. Will be overwritten by MetaData from Commit if provided.
         Refused               # If true, then this Authorisation is 'Refused'. Refused Authorisations will not count
         as signed. This value may be set during Commit TXs.
         ],
         ...
         ],
         'parameters'    : {                        # (Optional). 'parameters' are values that may be substituted into
         payment / receipt lines
         'key' : [                # 'key' is the variable name used in payment / receipt lines, we recommend that all
         keys are specified in lower case. Keys are not case sensitive when value substitution takes place, but are
         case sensitive for signing or commitment purposes. If two keys are given which resolve to the same lower-case
         value, then one will arbitrarily get precedence.
         Address,         # Address or Public Key that may update this variable via a 'Commit' transaction.
         Value,           # value to insert, empty string ('') indicates a not-yet-set value.
         CalculatedIndex, # 'Values' will be evaluated before use in 'CalculatedIndex' order. This allows a calculation
         sequence to be defined.
         ContractSpecific,# (Int) 0 : Signature message does not include ContractAddress, 1 : It does. This allows a
         parameter value to, optionally, be sent to multiple contracts is required.
         CalculationOnly, # (Int) 0 : Normal - Requires signature etc. 1 : Is only present as an intermediate value to
         be evaluated in consensus thus can not be changed and does not require signature.
         Signature        # Signature of '[ContractAddress|]key|Value' by 'Public Key'. 'ContractAddress|' is included
         in the message if 'ContractSpecific' != 0
         ],
         ...
         },
         'addencumbrances' :[                       # (Optional). Encumbrances to be put in place at the time of
         contract execution.
         [
         publickey,        # Address or Public Key that may update this variable via a 'Commit' transaction. If a
         signature is provided, then this needs to be a public key.
         fullassetid,      # Asset to which this encumbrance relates
         reference,        # Reference for this encumbrance, will be set to the contract address if omitted.
         amount,           # Amount of this Encumbrance
         [beneficiaries],  # Beneficiaries.  Those addresses that may exercise an encumbrance with Start and End Times.
         End time of 0 indicates unending. Format [[Address, StartUTC_Secs, EndUTC_Secs], ...]
         [administrators], # Administrators. Those addresses that may cancel (Amend as a future enhancement ?)
         an encumbrance with Start and End Times. End time of 0 indicates unending. Format [[Address, StartUTC_Secs,
         EndUTC_Secs], ...]
         Signature         # Signature of sha256(ujson.dumps([contractAddress, fullAssetID, reference, amount],
         sort_keys=True)).hexdigest()
         ],
         ...
         ],
         'events'        : [                  # List of events that can occur.
         'commit'
         'expiry'
         ],
         'startdate'     : nnn,               # (Optional) long(UTC Unix Epoch time, seconds) indicating the earlies
         time at which a DVP may execute. It may, of course, be signed or commited to before this time.
         'expiry'        : nnn,               # long(UTC Unix Epoch time, seconds)
         'encumbrance'   : [Use Creator Encumbrance (Bool), EncumbranceName (String) defaults to Contract Address],
         # (Optional) If included and 'Use Creator Encumbrance' is True, then Unsigned Parties are allowed (unless
         marked MustSign)
         # and unsigned payments will be fulfilled if there is an encumbrance to the address that creates the contract
         (not the contract address)
         # with the specified EncumbranceName.
         # Encumbrances can either be enduring or specific to a contract. To allow encumbrances specific to a contract,
         if
         # 'EncumbranceName' is empty, then the contract address is used as the EncumbranceName.
         # Enduring encumbrances are consumed as unsigned payments are made against them. Payments that are signed do
         not consume
         # encumbrances. Contract specific encumbrances (i.e. those that have the contract address as reference)
         are consumed as they
         # are used and deleted in any case when the contract exercises or expires.
         'protocol'      : "",                # User Data
         'metadata'      : ""
         }

         Encumbrances may be specified towards the contract author in which case the contract definition should
         indicate their possible existence.
         If an Encumbrance is specified, then unless a party is marked as 'MustSign', any appropriate encumbrance may
         be used without party signature or payment signature.
         In the case where a party IS marked as 'MustSign', then the party must be signed but, again, the payments
         need not be.

         */

        const hasParameter = immutableHelper.get(arrangementData, ['datas'], []).length > 0;


        // Get parties from actions.
        // parties in [address: partyData] form.
        const actionDataArr = immutableHelper.get(arrangementData, 'actions', []);

        let partiesData = {};

        for (const actionData of actionDataArr) {

            const actionType: ArrangementActionType = immutableHelper.get(actionData, ['actionType'], -1);
            const actionDataObj = immutableHelper.get(actionData, 'actionData', {});

            switch (actionType) {
                case ArrangementActionType.SEND:

                    partiesData = handleSendOrIssueActionData(actionDataObj, partiesData, hasParameter, false);
                    break;

                case ArrangementActionType.ISSUE:

                    partiesData = handleSendOrIssueActionData(actionDataObj, partiesData, hasParameter, true);

                    break;

                case ArrangementActionType.ENCUMBER:
                    break;

                case ArrangementActionType.COMMIT:
                    break;

                default:
                    throw new Error('Invalid action type when converting arrangement data.');

            }
        }

        // get partiesListData.
        const mustSignsObj = arrangementData.mustSigns || {};
        const partiesListData = constructPartiesListData(partiesData, mustSignsObj);

        // get authorisations from conditions
        const authorisationsList = getAuthorisationList(arrangementData);

        // get start datetime from condition
        const startDate = getExecuteTimeStamp(arrangementData);

        // get meta data and verifiers from docs
        const metaData = getMetaData(arrangementData);

        // get parameters data
        const parametersData = getParametersData(arrangementData);

        // Get add encumberance data
        const addEncData = immutableHelper.get(arrangementData, 'addEncs', []);

        // first address in wallet or issuing address.
        const contractCreatorAddr = immutableHelper.get(arrangementData, 'creatorAddress', false);

        const expiry = arrangementData.expiry;

        if (!contractCreatorAddr) {
            return false;
        }

        const contractData: ContractData = {
            __function: 'dvp_uk',
            parties: partiesListData,
            authorisations: authorisationsList,
            parameters: parametersData,
            addencumbrances: addEncData,
            events: ['commit', 'expiry'],
            expiry: expiry,
            startdate: startDate,
            protocol: 'dvp',
            // todo
            // The encumbrance is hardcoded to use 'use_encumbrance' now.
            // It should be specific to a unique reference, when the encumbrance is created.
            encumbrance: arrangementData.useEncum,
            metadata: JSON.stringify(metaData)
        };


        return {
            creatorAddress: contractCreatorAddr,
            contractFunction: 'dvp_uk',
            contractData: contractData
        };


    }

    static buildCancelContractMessageBody(contractAddress: string, commitAddress: string) {
        return this.handleWalletCommitContract({}, contractAddress, commitAddress, 0, 'cancelCommit');
    }

    static handleWalletCommitContract(contract, thisContractAddress, thisCommitAddr, thisPartyId, commitType) {

        const payList = [];
        const receiveList = [];
        const authoriseList = [];
        let contractData = {};

        if (commitType === 'partyCommit') {

        } else if (commitType === 'authorisationCommit') {

            let i = 0;
            for (i = 0; i < contract['authorisations'].length; i++) {
                const thisAuthorisorData = contract['authorisations'][i];

                if (thisAuthorisorData[0] === thisCommitAddr && Number(thisAuthorisorData[1]) === Number(thisPartyId)) {
                    const thisAuthorisorPub = thisCommitAddr;
                    const thisAuthorisorIdentifier = thisAuthorisorData[1];
                    const thisAuthorisorSignature = thisAuthorisorData[2];
                    const thisAuthorisorMeta = thisAuthorisorData[3];
                    const thisAuthorisorCommitData = [thisAuthorisorPub, thisAuthorisorIdentifier,
                        thisAuthorisorSignature, thisAuthorisorMeta];

                    authoriseList.push(thisAuthorisorCommitData);
                }
            }

            contractData = {
                contractfunction: 'dvp_uk_commit',
                issuingaddress: thisCommitAddr,
                contractaddress: thisContractAddress,
                party: [],
                commitment: payList,
                receive: receiveList,
                authorise: authoriseList
            };
        } else if (commitType === 'cancelCommit') {
            contractData = {
                'contractfunction': 'dvp_uk_commit',
                'issuingaddress': thisCommitAddr,
                'contractaddress': thisContractAddress,
                'cancel': [thisCommitAddr, '']
            };
        }

        return {
            'commitaddress': thisCommitAddr,
            'function': 'dvp_uk_commit',
            'contractdata': contractData,
            'contractaddress': thisContractAddress
        };
    }

}

/**
 * Convert arrangement send action to contract party data and append to existing parties data.
 *
 * @param actionData
 * @param parties
 * @param hasParameter
 * @param isIssuance
 * @return {PartiesData}
 */
function handleSendOrIssueActionData(actionData: SendActionData | IssueActionData, parties: PartiesData,
                                     hasParameter: boolean, isIssuance: boolean): PartiesData {
    const newParties: PartiesData = immutableHelper.copy(parties);
    const fromAddress = actionData.fromAddress;
    const toAddress = actionData.toAddress;
    const asset = actionData.asset;
    const amount = actionData.amount;
    const actionMetaData = actionData.metaData;

    // from address

    // If this address has yet to pay or received anything.
    if (typeof newParties[fromAddress] === 'undefined') {
        newParties[fromAddress] = {
            pay: {},
            receive: {}
        };
    }

    if (typeof newParties[fromAddress]['pay'][asset] === 'undefined') {
        // If this address has yet to pay anything

        newParties[fromAddress]['pay'][asset] = {
            amount: amount,
            isIssuance: isIssuance,
            metaData: actionMetaData
        };
    } else {
        // If this address has already pay something. so add this to existing pay.

        // has parameter, meaning has parameter in the amount (formula instead of number).
        // we can not handle both formula and number situation as string here, because wallet node does not seen to
        // allow it.
        if (hasParameter) {
            newParties[fromAddress]['pay'][asset].amount = newParties[fromAddress]['pay'][asset].amount + ' + ' + amount;
        } else {
            newParties[fromAddress]['pay'][asset].amount = Number(newParties[fromAddress]['pay'][asset].amount) + Number(amount);
        }
    }

    // to address

    // If this address has yet to pay or received anything.
    if (typeof newParties[toAddress] === 'undefined') {
        newParties[toAddress] = {
            pay: {},
            receive: {}
        };
    }

    if (typeof newParties[toAddress]['receive'][asset] === 'undefined') {
        // If this address has yet to pay anything
        newParties[toAddress]['receive'][asset] = amount;
    } else {
        // If this address has already pay something. so add this to existing pay.

        // has parameter, meaning has parameter in the amount (formula instead of number).
        // we can not handle both formula and number situation as string here, because wallet node does not seen to
        // allow it.
        if (hasParameter) {
            newParties[toAddress]['receive'][asset] = newParties[toAddress]['receive'][asset] + ' + ' + amount;
        } else {
            newParties[toAddress]['receive'][asset] = Number(newParties[toAddress]['receive'][asset]) + Number(amount);
        }
    }

    return newParties;
}

/**
 *
 * @param partiesData
 * @param mustSignsObjs
 * @return {Array<number|PartyListEntryData>}
 */
function constructPartiesListData(partiesData: PartiesData, mustSignsObjs: {[address: string]: boolean}): Array<number | PartyListEntryData> {

    let partyCount = 0;

    // construct party list
    const partiesListData: Array<number | PartyListEntryData> = immutableHelper.reduce(partiesData,
        (resultPartiesList: Array<PartyListEntryData>, partyData: PartyData, address: Address) => {
            const partyIdentifier: PartyIdentifier = '';
            const partySignAddress: PartySignAddress = address;
            const partyPub: PartyPublicKey = ''; // optional.
            const signedContractAddr: SignContractAddress = ''; // optional.
            const mustSignDefined = mustSignsObjs[partySignAddress];
            const mustSign: MustSign =  (typeof mustSignDefined !== 'undefined') ? mustSignDefined : false ; // optional.

            // construct pay list
            const partyPayData = partiesData[address].pay;
            const partyPayList: Array<PartyListEntryPayListData> = immutableHelper.reduce(partyPayData,
                (resultPayList: Array<PartyListEntryPayListData>, payDataImu: any, asset: string) => {

                    const payData: PayAmountData = payDataImu.toJS();
                    const assetParts = asset.split('|');
                    const payAmount = payData.amount;
                    const payPublicKey = ''; // optional
                    const paySignature = ''; // optional
                    const isIssuance = payData.isIssuance;
                    const payListMeta = payData.metaData;

                    const payListMetaStr = JSON.stringify(payListMeta);

                    const payRow: PartyListEntryPayListData = [address, assetParts[0], assetParts[1], payAmount, payPublicKey,
                        paySignature, isIssuance, payListMetaStr];

                    resultPayList.push(payRow);

                    return resultPayList;

                }, []);

            // construct receiving list.
            const partyReceiveData = partiesData[address].receive;
            const partyReceiveList: Array<PartyListEntryReceiveListData> = immutableHelper.reduce(partyReceiveData,
                (resultReceiveList: Array<PartyListEntryReceiveListData>, receiveAmount: ReceiveAmountData, asset: string) => {

                    const assetParts = asset.split('|');

                    const receiveRow: PartyListEntryReceiveListData = [address, assetParts[0], assetParts[1], receiveAmount];

                    resultReceiveList.push(receiveRow);

                    return resultReceiveList;

                }, []);


            const partyRow: PartyListEntryData = [partyIdentifier, partySignAddress, partyPayList, partyReceiveList,
                partyPub, signedContractAddr, mustSign];

            partyCount++;

            resultPartiesList.push(partyRow);

            return resultPartiesList;

        }, [0]);

    partiesListData[0] = partyCount;

    return partiesListData;
}

/**
 *
 * @param arrangementData
 * @return {any}
 */
function getAuthorisationList(arrangementData: ArrangementData): Array<AuthorisationEntryData> {
    const conditionDataList: Array<ConditionData> = immutableHelper.get(arrangementData, 'conditions', []);
    let authorisationId = 0;

    // get authorisations from conditions
    const authorisationsList = immutableHelper.reduce(conditionDataList, (resultAuthorisationsList, conditionImu: any) => {
        const condition = conditionImu.toJS();
        const conditionType = condition.conditionType;

        if (conditionType === ConditionType.AUTHORISE) {

            const conditionData: AuthoriseConditionData = condition.conditionData;

            const identifier = conditionData.authoriseRef;
            const authorisationMeta = {
                type: 'authorisor',
                msg: identifier,
                address: conditionData.address
            };

            const authorisationMetaStr = JSON.stringify(authorisationMeta);
            const authorisationRow = [conditionData.address, authorisationId.toString(), '', authorisationMetaStr];
            resultAuthorisationsList.push(authorisationRow);
            authorisationId++;

        }
        return resultAuthorisationsList;
    }, []);

    // get verifier list from docs
    const docDataList = immutableHelper.get(arrangementData, 'docs', []);
    const verifierList = immutableHelper.reduce(docDataList, (resultVerifierList, docImu) => {
        const doc = docImu.toJS();

        const docHash = doc.hash;
        const docTitle = doc.fileTitle;
        const docVerifiers = doc.verifyAddresses;

        const msg = {
            title: docTitle,
            hash: docHash
        };

        const msgStr = JSON.stringify(msg);

        const docVerifiersList = immutableHelper.reduce(docVerifiers, (resultDocVerifierList, docVerifierImu) => {
            const docVerifier = docVerifierImu.toJS();

            // store verifier in authorisation list.
            const docVerifierMeta = {
                type: 'doc_verifier',
                msg: msgStr,
                address: docVerifier
            };

            const docVerifierMetaStr = JSON.stringify(docVerifierMeta);
            const verifierRow = [docVerifier, authorisationId.toString(), '', docVerifierMetaStr];

            resultDocVerifierList.push(verifierRow);
            authorisationId++;

            return resultDocVerifierList;
        }, []);

        resultVerifierList = [...resultVerifierList, ...docVerifiersList];

        return resultVerifierList;

    }, []);

    return [...authorisationsList, ...verifierList];
}

/**
 *
 * @param arrangementData
 * @return {number}
 */
function getExecuteTimeStamp(arrangementData: ArrangementData): number {

    const conditionDataList: Array<ConditionData> = arrangementData.conditions;

    // get execution from conditions
    // if multiple execution time condition. pick the first one.
    const executionTimeList = immutableHelper.reduce(conditionDataList, (resultAuthorisationsList, conditionImu: any) => {
        const condition: ConditionData = conditionImu.toJS();
        const conditionType = condition.conditionType;

        if (conditionType === ConditionType.TIME) {

            const conditionData: TimeConditionData = condition.conditionData;

            const executionTime = conditionData.executeTimeStamp;

            resultAuthorisationsList.push(executionTime);

        }
        return resultAuthorisationsList;
    }, []);

    // if multiple execution time condition. pick the first one.
    return executionTimeList[0];
}

function getMetaData(arrangementData: ArrangementData) {

    const docDataList = immutableHelper.get(arrangementData, 'docs', []);

    const docMetaData = immutableHelper.reduce(docDataList, (resultDocMetaData, docImu) => {
        const doc = docImu.toJS();

        const docHash = doc.hash;
        const docTitle = doc.fileTitle;

        resultDocMetaData[docTitle] = docHash;

        return resultDocMetaData;
    }, {});

    const titleMetaData = arrangementData.stepTitle;

    return {
        doc: docMetaData,
        title: titleMetaData
    };

}

function getParametersData(arrangementData: ArrangementData): Array<ParameterData> {

    const datas = immutableHelper.get(arrangementData, 'datas', []);

    const paramtersData: Array<ParameterData> = immutableHelper.reduce(datas, (resultParametersData, dataImu) => {
        const data = dataImu.toJS();
        const dataName = data.parameter;
        const dataAddress = data.address;

        resultParametersData[dataName] = [dataAddress, '', 0, 0, 0, ''];

        return resultParametersData;
    }, {});

    return paramtersData;
}
