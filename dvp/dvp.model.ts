export const partyA = 'partyA';
export const partyB = 'partyB';

export class DvpParty {
    id: string;
    title: string;
    toggleAssetReturn?: boolean;
}

export class DvpForm {
    creator: ItemDropdown[];
    expireDate: string;
    expireTime: string;
    partyA: DvpFormParty;
    partyB: DvpFormParty;
}

export class DvpFormParty {
    asset: ItemDropdown[];
    address: string;
    amount: number;
    return_asset: boolean;
}

interface ItemDropdown {
    id: string;
    text: string;
}
