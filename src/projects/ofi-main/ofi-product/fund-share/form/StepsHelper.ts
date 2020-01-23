import * as _ from 'lodash';

import { MultilingualService } from '@setl/multilingual';

export class StepsHelper {
    private stepsArr = [
        {
            id: ShareCreationStepsEnum.Validate,
            message: this.translate.translate('Validating form data'),
            error: this.translate.translate('Issuer (ISIN) or Asset (Full Share Name), already exist'),
        },
        {
            id: ShareCreationStepsEnum.CreateWallet,
            message: this.translate.translate('Creating a new wallet'),
            error: this.translate.translate('Failed to create a new wallet'),
        },
        {
            id: ShareCreationStepsEnum.UpdatePermissions,
            message: this.translate.translate('Updating share permissions'),
            error: this.translate.translate('Failed to update share permissions'),
        },
        {
            id: ShareCreationStepsEnum.CreateAddress,
            message: this.translate.translate('Creating share address'),
            error: this.translate.translate('Failed to create share address'),
        },
        {
            id: ShareCreationStepsEnum.CreateWalletLabel,
            message: this.translate.translate('Creating wallet identifier'),
            error: this.translate.translate('Failed to create wallet identifier'),
        },
        {
            id: ShareCreationStepsEnum.CreateFundShare,
            message: this.translate.translate('Registering new share'),
            error: this.translate.translate('Failed to register new share'),
        },
        {
            id: ShareCreationStepsEnum.RegisterIssuer,
            message: this.translate.translate('Registering new issuer'),
            error: this.translate.translate('Failed to register new issuer'),
        },
        {
            id: ShareCreationStepsEnum.RegisterAsset,
            message: this.translate.translate('Registering new asset'),
            error: this.translate.translate('Failed to register new asset'),
        },
        {
            id: ShareCreationStepsEnum.Finishing,
            message: this.translate.translate('Finishing creation of Share'),
            error: this.translate.translate('Failed to create share'),
        },
        {
            id: ShareCreationStepsEnum.Success,
            message: this.translate.translate('Share successfully created'),
            error: this.translate.translate('Failed to create share'),
        },
    ];

    constructor(private translate: MultilingualService) { }

    steps(stepId?: ShareCreationStepsEnum): ShareCreationStep | ShareCreationStep[] {
        return stepId !== undefined ?
            _.find(this.stepsArr, (step: ShareCreationStep) => { return step.id === stepId; }) :
            this.stepsArr;
    }
}

export interface ShareCreationStep {
    id: ShareCreationStepsEnum;
    message: string;
    error: string;
}

export enum ShareCreationStepsEnum {
    Validate,
    CreateWallet,
    UpdatePermissions,
    CreateAddress,
    CreateWalletLabel,
    CreateFundShare,
    RegisterIssuer,
    RegisterAsset,
    Finishing,
    Success,
}
