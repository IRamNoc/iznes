import { ManagementCompanyFileMetadata } from './management-company-file-metadata';

describe('ManagementCompanyFileMetadata', () => {

    let fileMetaData;
    const fakeData = {
        signatureTitle: 'signatureTitle',
        signatureHash: 'signatureHash',
        logoTitle: 'logoTitle',
        logoHash: 'logoHash',
    };

    const emptyState = {
        signatureTitle: '',
        signatureHash: '',
        logoTitle: '',
        logoHash: '',
    };

    beforeEach(() => {
        fileMetaData = new ManagementCompanyFileMetadata();
    });

    it('should return all the properties', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getProperties()).toEqual(fakeData);
    });

    it('should return the title', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getTitle('signature')).toEqual(fakeData.signatureTitle);
    });

    it('should return the hash', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getHash('signature')).toEqual(fakeData.signatureHash);
    });

    it('should set all the properties', () => {
        expect(fileMetaData.getProperties()).toEqual(emptyState);
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getProperties()).toEqual(fakeData);
    });

    it('should set properties for one file', () => {
        expect(fileMetaData.getProperties()).toEqual(emptyState);

        const fakePayload = {
            title: 'title',
            hash: 'hash',
        };
        fileMetaData.setProperty('logo', fakePayload);
        expect(fileMetaData.getTitle('logo')).toEqual(fakePayload.title);
        expect(fileMetaData.getHash('logo')).toEqual(fakePayload.hash);
    });

    it('should set all properties to empty strings', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getProperties()).toEqual(fakeData);

        fileMetaData.reset();
        expect(fileMetaData.getProperties()).toEqual(emptyState);
    });

    it('should return true when all properties have values', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.isValid()).toEqual(true);
    });

    it('should return false when not all properties have values', () => {
        const fakePayload = {
            ...fakeData,
            signatureHash: '',
        };
        fileMetaData.setProperties(fakePayload);
        expect(fileMetaData.isValid()).toEqual(false);
    });
});
