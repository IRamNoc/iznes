export interface FieldStructure {
    label: string;
    value: string;
}

export interface InvestorModel {
    companyName: FieldStructure;
    firstName: FieldStructure;
    lastName: FieldStructure;
    email: FieldStructure;
    phoneNumber: FieldStructure;
    approvalDateRequest: FieldStructure;
    clientReference: FieldStructure;
}
