import { browser, by, element } from 'protractor';

export class ClaritySamplePage {
    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('app-root h1')).getText();
    }

    login() {
        this.sendEmailAddress();
        this.sendPassword();
        this.clickSubmitButton();
    }

    sendEmailAddress() {
        element(by.id('login-email')).sendKeys('test.test@setl.io');
    }

    sendPassword() {
        element(by.id('login-password')).sendKeys('supersecret123');
    }

    clickSubmitButton() {
        element(by.id('login-submit')).click();
    }
}
