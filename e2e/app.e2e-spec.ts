import { ClaritySamplePage } from './app.po';
import { browser } from 'protractor';

describe('clarity-sample App', () => {
    let page: ClaritySamplePage;

    beforeEach(() => {
        page = new ClaritySamplePage();
        page.navigateTo();
        const baseUrl = 'http://localhost:4200';
        browser.driver.get(baseUrl);
        expect(page.getParagraphText()).toEqual('Welcome to the SETL Intranet');
    });

    it('should display welcome message', () => {
        const baseUrl = 'http://localhost:4200';
        browser.driver.get(baseUrl);
        page.login();
    });
});
