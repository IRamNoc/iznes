export class IssueAssetActionModel {
    public readonly type: string = 'issue-asset';
    public messageBody? = '';
    completeText = 'Complete';
    public toAddress: string;
    public amount: number;
}

