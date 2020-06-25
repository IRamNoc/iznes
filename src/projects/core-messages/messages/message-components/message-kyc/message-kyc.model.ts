export class MessageKycConfig {
    type: string;
    investorFirstName: string;
    investorCompanyName: string;
    investorEmail: string;
    investorPhoneNumber: string;
    amFirstName: string;
    amCompanyName: string;
    lang: string;
    changeAccepted?: boolean;
    currentClassification?: number;
    isClientFile?: number;
    isNowCP?: boolean;
}
