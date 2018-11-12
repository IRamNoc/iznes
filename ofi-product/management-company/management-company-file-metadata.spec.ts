import { ManagementCompanyFileMetadata } from './management-company-file-metadata';

describe('ManagementCompanyFileMetadata', () => {

    let fileMetaData;
    const fakeData = {
        signatureTitle: 'signatureTitle',
        signatureHash: 'signatureHash',
        logoTitle: 'logoTitle',
        logoHash: 'logoHash',
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
        const expectedResult = {
            signatureTitle: null,
            signatureHash: null,
            logoTitle: null,
            logoHash: null,
        };
        expect(fileMetaData.getProperties()).toEqual(expectedResult);
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getProperties()).toEqual(fakeData);
    });

    it('should set properties for one file', () => {
        const expectedResult = {
            signatureTitle: null,
            signatureHash: null,
            logoTitle: null,
            logoHash: null,
        };
        expect(fileMetaData.getProperties()).toEqual(expectedResult);

        const fakePayload = {
            title: 'title',
            hash: 'hash',
        };
        fileMetaData.setProperty('logo', fakePayload);
        expect(fileMetaData.getTitle('logo')).toEqual(fakePayload.title);
        expect(fileMetaData.getHash('logo')).toEqual(fakePayload.hash);
    });

    it('should set all properties to null', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.getProperties()).toEqual(fakeData);

        const expectedResult = {
            signatureTitle: null,
            signatureHash: null,
            logoTitle: null,
            logoHash: null,
        };
        fileMetaData.reset();
        expect(fileMetaData.getProperties()).toEqual(expectedResult);
    });

    it('should return true when all properties have values', () => {
        fileMetaData.setProperties(fakeData);
        expect(fileMetaData.isValid()).toEqual(true);
    });

    it('should return false when not all properties have values', () => {
        const fakePayload = {
            ...fakeData,
            signatureHash: null,
        };
        fileMetaData.setProperties(fakePayload);
        expect(fileMetaData.isValid()).toEqual(false);
    });
});
