export interface ManagementCompanyMetaData {
    signatureTitle: string;
    signatureHash: string;
    logoTitle: string;
    logoHash: string;
}

export type ManagementCompanyFileMetadataField = 'signature' | 'logo';

export class ManagementCompanyFileMetadata {
    signature = {
        title: <string>null,
        hash: <string>null,
    };
    logo = {
        title: <string>null,
        hash: <string>null,
    };

    getProperties(): ManagementCompanyMetaData {
        return {
            signatureTitle: this.signature.title,
            signatureHash: this.signature.hash,
            logoTitle: this.logo.title,
            logoHash: this.logo.hash,
        };
    }

    getTitle(field: ManagementCompanyFileMetadataField): string {
        return this[field].title;
    }

    getHash(field: ManagementCompanyFileMetadataField): string {
        return this[field].hash;
    }

    setProperties(metaData: ManagementCompanyMetaData): void {
        this.signature = {
            title: metaData.signatureTitle,
            hash: metaData.signatureHash,
        };
        this.logo = {
            title: metaData.logoTitle,
            hash: metaData.logoHash,
        };
    }

    setProperty(field: ManagementCompanyFileMetadataField, metaData: { title: string; hash: string }): void {
        this[field] = {
            title: metaData.title,
            hash: metaData.hash,
        };
    }

    reset(): void {
        this.signature = {
            title: null,
            hash: null,
        };
        this.logo = {
            title: null,
            hash: null,
        };
    }

    isValid(): boolean {
        return !!(this.signature.title && this.signature.hash && this.logo.title && this.logo.hash);
    }
}
