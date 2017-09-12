package com.setl.UI.common.SETLUIHelpers;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.text.ParseException;

import static com.setl.UI.common.SETLUIHelpers.ExpiryDateHelper.calculateExpiryDate;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


public class WalletDetailsHelper extends LoginAndNavigationHelper {

    private static final Logger logger = LogManager.getLogger(WalletDetailsHelper.class);


    public static void populateNewRelationshipFieldsWithNewAddress(String senderIndex) throws Exception {
        selectSenderWallet(senderIndex);
        createNewReceivingAddress();
        submitRelationshipDetails("Add Relationship Successfully", "Added Success Message not displayed ",  "Relationship");
    }

    public static void populateNewRelationshipFieldsWithSameSenderAndCurrentWallet(String senderIndex) throws Exception {
        selectSenderWallet(senderIndex);
        createNewReceivingAddress();
        submitRelationshipDetails("Sender wallet can not be the same as current wallet", "Address Validation error message not displayed ",  "Relationship");
    }

    public static void populateNewRelationshipFieldsWithNoAddress(String senderIndex) throws Exception {
        selectSenderWallet(senderIndex);
        submitRelationshipDetails("Sender wallet and receiving address are required", "Address Validation error message not displayed ",  "Relationship");
    }

    public static void populateNewRelationshipFieldsWithNoData() throws Exception {
        submitRelationshipDetails("Sender wallet and receiving address are required", "Address Validation error message not displayed ",  "Relationship");
    }

    public static void populateNewRelationshipFieldsWithNoSenderWallet() throws Exception {
        createNewReceivingAddress();
        submitRelationshipDetails("Sender wallet and receiving address are required", "Address Validation error message not displayed ",  "Relationship");
    }

    public static void   populateSameRelationshipFieldsWithNewSenderWalletAndNewAddress(String senderIndex) throws Exception {
        acceptCookies();
        selectSenderWallet(senderIndex);
        createNewReceivingAddress();
        submitRelationshipDetails("Add Relationship Successfully", "Added Success Message not displayed ",  "Add Relationship ");
        selectSenderWallet(senderIndex);
        createNewReceivingAddress();
        submitRelationshipDetails("Relationship exist.", "Relationship exists message not displayed ",  "Duplicate Relationship ");
    }

    public static void populateNewRelationshipFieldsWithExistingAddress(String senderIndex, String receiverIndex) throws Exception {
        selectSenderWallet(senderIndex);
        selectReceivingWallet(receiverIndex);
        submitRelationshipDetails("Add Relationship Successfully", "Added Success Message not displayed ",  "Add Relationship ");
    }

    private static void populateRequestAssetFields(String asset, String type, String from, String amount) throws InterruptedException {
        selectAsset(asset);
        selectRequestType(type);
        selectRequestRelationship(from);
        enterAmount(amount);
        submitRequestDetails();
        verifyPopupMessageText("Request Sent Successfully", "Request Sent Message not displayed ");
    }

    public static void selectAndActionNewAddressNoAck() throws InterruptedException {
        waitForActionField();
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('newAddress').trigger('chosen:updated').click()");
        executeAction();
    }

    public static String selectAndActionNewAddress() throws InterruptedException {
        waitForActionField();
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('newAddress').trigger('chosen:updated').click()");
        executeAction();
        String address = CaptureNewAddress.getAddress();
        verifyPopupMessageText("Address :", "New Address Created message not displayed ");
        return address;
    }

    public static void verifySenderWallet() {
        assertEquals("ECB_Wallet1", driver.findElement(By.xpath("//table[@id='leiRelationships-table']/tbody/tr[1]/td[2]")).getText());
    }

    public static void selectWalletToUse(String walletIndex) throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#walletToUse').val('" + walletIndex + "').trigger('chosen:updated').trigger('change')");
    }

    public static void selectChainToUse(String chainIndex) throws InterruptedException {
        Thread.sleep(500);
        ((JavascriptExecutor) driver).executeScript("$('#chainToConnect').val('" + chainIndex + "').trigger('chosen:updated').trigger('change')");
    }

    public static void actionRegisterIssuer(String issuer, String receiverIndex) throws InterruptedException {
        waitForActionField();
        String xpathToAction = ".//*[@id='wallet_action_select_chosen']/div/ul/li[2]";
        Thread.sleep(600);
        WebElement action = driver.findElement(By.xpath(xpathToAction));
        String actionClass = driver.findElement(By.xpath(xpathToAction)).getAttribute("class");
        if ("active-result".equals(actionClass)) {
            action.click();
            populateIssuerFields(issuer, receiverIndex);
            executeAction();
            verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
        } else {
            System.out.println("Issuer already exists");
        }
    }

    public static void actionRegisterIssuerWithNewAddress(String issuer) throws InterruptedException
    {

        populateIssuerWithNewAddressFields(issuer);
        executeAction();
        verifyPopupMessageText("Transaction :", "New Issuer was not created ");
    }

    public static void selectRegisterIssuer() throws InterruptedException {
        scrollElementIntoViewByCss("#wallet_action_select_chosen > a.chosen-single > span");
        driver.findElement(By.cssSelector("#wallet_action_select_chosen > a.chosen-single > span")).click();
        if ((driver.findElement(By.cssSelector("li.disabled-result")).getText().equals("Register Issuer")))
        {
             fail("Issuer has already been created. Only One Issuer is permitted");
        }else{
            ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('registerIssuer').trigger('chosen:updated').click().trigger('change')");
             }
    }

    private static void selectAsset(String asset) throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-tab-2 .asset').val('" + asset + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectRequestType(String type) throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#request_relationshiporaddress').val('" + type + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectRequestRelationship(String fromValue) throws InterruptedException {
        driver.findElement(By.xpath(".//*[@id='receivetorelationship']/div/div/div/a/span")).click();

        String xpathToReceiver = ".//*[@id='receivetorelationship']/div/div/div/div/ul/li[" + fromValue + "]";
        scrollElementIntoViewByXpath(xpathToReceiver);
        driver.findElement(By.xpath(xpathToReceiver)).click();
    }

    private static void enterAmount(String amount) throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-tab-2 .amount').val('" + amount + "').trigger('chosen:updated')");
    }

    public static void selectRegisterAsset() throws InterruptedException {
       ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('registerAsset').trigger('chosen:updated').click().trigger('change')");
    }

    public static void selectSplit() throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('split').trigger('chosen:updated').click().trigger('change')");
    }

    public static void selectDVP() throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('dvp').trigger('chosen:updated').click().trigger('change')");
    }

    public static void selectDistributionAction() throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('distribution').trigger('chosen:updated').click().trigger('change')");
    }

    public static void actionRegisterAsset(String instrument, String identifierType, String identifier,
                                           String assetShortName, String assetFullName, String companyName,
                                           String companyNumber,  String assetType,
                                           String denomination) throws InterruptedException {

        populateRegisterAssetFields(instrument, identifierType, identifier, assetShortName, assetFullName, companyName, companyNumber, assetType, denomination);
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
    }

    private static void waitForActionField() throws InterruptedException {
        try {
            WebElement action = driver.findElement(By.xpath(".//*[@id='wallet_action_select_chosen']/a/span"));
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(action));
            wait.until(elementToBeClickable(action));
            action.click();
            } catch (Exception e)
                {
                    System.out.println("Action field was not ready " + e);
                }

    }

    public static void actionNewIssueWithRelationship(String issueIndex, String recipientType) throws InterruptedException {
        populateNewIssueWithRelationshipFields(issueIndex, "4", "1000", recipientType);
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
    }

    public static void selectNewIssue() throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('newIssue').trigger('chosen:updated').click().trigger('change')");
    }

    public static void actionNewIssue(String issueIndex, String quantity, String recipientType, String recipentType1) throws InterruptedException {
        actionNewIssueWithOwnedAddress(issueIndex, quantity, recipientType, recipentType1);
    }

    private static boolean waitForRegisterAsset() {
        Assert.assertTrue(isElementPresent(By.id("wallet-action-registerasset")));
        String displayValue = driver.findElement(By.id("wallet-action-registerasset")).getCssValue("display");

        try {
            assert (displayValue).equalsIgnoreCase("block");
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    private static boolean waitForActionNewIssue() {
        Assert.assertTrue(isElementPresent(By.id("wallet-action-newissue")));
        String displayValue = driver.findElement(By.id("wallet-action-newissue")).getCssValue("display");

        try {
            assert (displayValue).equalsIgnoreCase("block");
            return true;
        } catch (NotFoundException e) {
            return false;
        }
    }

    public static void actionNewIssueWithOwnedAddress(String issueIndex, String qty, String recipientType, String recipientType1) throws InterruptedException {
        populateNewIssueWithNewOwnedAddress(issueIndex, qty, recipientType, recipientType1);
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
    }

    public static void actionDistribution(String distribution) throws InterruptedException {
        populateDistributionFields(distribution,  "1000");
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
    }


    public static void actionSplit() throws InterruptedException {
        populateSplitFields( "3");
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
    }

    public static void actionDVP(int daysToExpiry, String address1, String address2) throws InterruptedException, ParseException {

        String expiryDate = calculateExpiryDate(daysToExpiry);
        populateDVPFields("2", expiryDate, "18:00", address1, address2);
    }

    public static void selectAndActionDVPWithTwoOwnedAddresses(int daysToExpiry, String address1, String address2) throws InterruptedException, ParseException {

        String expiryDate = calculateExpiryDate(daysToExpiry);
        waitForActionField();

        String xpathToAction = ".//*[@id='wallet_action_select_chosen']/div/ul/li[6]";
        driver.findElement(By.xpath(xpathToAction)).click();

        populateDVPFieldsTwoOwnedAddresses("2", expiryDate, "18:00", address1, address2);
    }

    public static void actionDVPWithTwoOwnedAddresses(int daysToExpiry) throws InterruptedException, ParseException {

        String expiryDate = calculateExpiryDate(daysToExpiry);
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('dvp').trigger('chosen:updated').click().trigger('change')");

        populateDVPFieldsTwoOwnedAddresses("2", expiryDate, "18:00");
    }

    private static void populateSplitFields(String ratio) throws InterruptedException {
        enterSplitRatio(ratio);
    }

    private static void populateDVPFields(String addressIndex, String expiryDate, String expiryTime, String address1, String address2) {
        selectContractCreateAddress(addressIndex);
        enterExpiryDate(expiryDate);
        enterExpiryTime(expiryTime);
        selectPartyAAsset("1");
        selectPartyAAddressType("2");
        selectPartyAOwnedAddress(address1);
        enterPartyAAmount("100");
        selectPartyBAsset("2");
        selectPartyBAddressType("1");
        selectPartyBRelation("1");
        enterPartyBAmount("150");
    }

    private static void populateDVPFieldsTwoOwnedAddresses(String addressIndex, String expiryDate, String expiryTime, String address1, String address2
    ) {
        selectContractCreateAddress(addressIndex);
        selectContractNewAddress(addressIndex);
        enterExpiryDate(expiryDate);
        enterExpiryTime(expiryTime);
        selectPartyAAsset("1");
        selectPartyAAddressType("2");
        selectPartyAOwnedAddress(address1);
        enterPartyAAmount("100");
        selectPartyBAsset("2");
        selectPartyBAddressType("2");
        selectPartyBOwnedAddress(address2);
        enterPartyBAmount("150");
    }

    private static void populateDVPFieldsTwoOwnedAddresses(String addressIndex, String expiryDate, String expiryTime) throws InterruptedException {
        createNewContractCreatorAddress();
        String address = CaptureNewAddress.getAddress();
        verifyPopupMessageText("Address :", "New Address Created message not displayed ");
        selectContractCreateAddress(address);
        enterExpiryDate(expiryDate);
        enterExpiryTime(expiryTime);
        selectPartyAAsset("1");
        selectPartyAAddressType("2");
        selectPartyAOwnedAddress("2");
        enterPartyAAmount("100");
        selectPartyBAsset("2");
        selectPartyBAddressType("2");
        selectPartyBOwnedAddress("3");
        enterPartyBAmount("150");
    }

    private static void selectPartyAOwnedAddress(String addressAIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + addressAIndex + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectPartyBOwnedAddress(String addressBIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + addressBIndex + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectPartyAAsset(String assetAIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + assetAIndex + "').trigger('chosen:updated').trigger('change')");

    }

    private static void selectPartyAAddressType(String addressTypeAIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + addressTypeAIndex + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectPartyARelation(String relationAIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + relationAIndex + "').trigger('chosen:updated').trigger('change')");

    }

    private static void enterPartyAAmount(String amountA) {
        driver.findElement(By.xpath(".//*[@id='wallet-action-dvp']/div[4]/div[8]/div/input")).clear();
        driver.findElement(By.xpath(".//*[@id='wallet-action-dvp']/div[4]/div[8]/div/input")).sendKeys(amountA);
    }

    private static void selectPartyBAsset(String assetBIndex) {

        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('Payment_Bank1_Issuer2|GBP').trigger('chosen:updated').trigger('change')");

    }

    private static void selectPartyBAddressType(String addressTypeBIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + addressTypeBIndex + "').trigger('chosen:updated').trigger('change')");

    }

    private static void selectPartyBRelation(String relationBIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + relationBIndex + "').trigger('chosen:updated').trigger('change')");

    }

    private static void enterPartyBAmount(String amountB) {
        driver.findElement(By.xpath(".//*[@id='wallet-action-dvp']/div[5]/div[8]/div/input")).clear();
        driver.findElement(By.xpath(".//*[@id='wallet-action-dvp']/div[5]/div[8]/div/input")).sendKeys(amountB);
    }

    private static void enterExpiryDate(String expiryDate) {
        driver.findElement(By.cssSelector("input.form-control.expiryDate")).clear();
        driver.findElement(By.cssSelector("input.form-control.expiryDate")).sendKeys(expiryDate);
    }

    private static void enterExpiryTime(String expiryTime) {
        driver.findElement(By.cssSelector("input.form-control.expiryTime")).clear();
        driver.findElement(By.cssSelector("input.form-control.expiryTime")).sendKeys(expiryTime);
    }

    private static void selectAssetToSplit(String asset) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-split .form-control.m-b.chosen').val('" + asset + "').trigger('chosen:updated').trigger('change')");
    }

    private static void enterSplitRatio(String ratio) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement splitRatio = wait.until(visibilityOfElementLocated(By.cssSelector("input.form-control.split-ratio")));
        splitRatio.clear();
        splitRatio.sendKeys(ratio);
        splitRatio.sendKeys();
    }

    private static void selectContractCreateAddress(String address) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp .chosen-select.creatorAddress.ownedAddressSelect.form-control.mlp').val('" + address + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectContractNewAddress(String addressIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-dvp.form-control.m-b.chosen.asset.all-asset-select').val('" + addressIndex + "').trigger('chosen:updated').trigger('change')");

    }

    private static void populateDistributionFields(String distribution, String quantity) {
        selectDistributionIssue(distribution);
        selectDistribution(distribution);
        enterPayQuantity(quantity);
    }

    private static void populateRegisterAssetFields(String instrument, String identifierType, String identifier,
                                                    String assetShortName, String assetFullName,
                                                    String companyName, String companyNumber,String assetType,
                                                    String denomination) throws InterruptedException {
        navigateToActionsTab();
        enterAssetInstrument(instrument);
        selectAssetIdentifierType(identifierType);
        enterAssetIdentifier(identifier);
        enterAssetShortName(assetShortName);
        enterAssetFullName(assetFullName);
        enterCompanyName(companyName);
        enterCompanyNumber(companyNumber);
        selectAssetType(assetType);
        selectAssetDenomination(denomination);
    }

    private static void populateNewIssueWithRelationshipFields(String issueIndex, String payToIndex, String quantity, String recipientType) throws InterruptedException {
        selectIssue(issueIndex);
        selectRecipientType(recipientType);
        selectPayTo(payToIndex);
        enterQuantity(quantity);
    }

    private static void populateNewIssueWithOwnedAddress(String issueIndex, String payToIndex, String quantity, String recipientType) throws InterruptedException {
        selectIssue(issueIndex);
        selectRecipientType(recipientType);
        selectPayTo(payToIndex);
        enterQuantity(quantity);
    }

    private static void populateNewIssueWithNewOwnedAddress(String issueIndex, String quantity, String recipientType, String recipientType1) throws InterruptedException {
        selectIssue(issueIndex);
        selectRecipientType(recipientType);
        selectRecipientType(recipientType1);
        selectPayToNewAddress();
        enterQuantity(quantity);
    }

    private static void selectIssue(String issueIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#leiRelationship-tab-2  .chosen-select.senderWallet').val('" + issueIndex + "').trigger('chosen:update')");
    }

    private static void selectRecipientType(String recipientType) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-newissue .form-control.m-b.chosen').val('" + recipientType + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectPayTo(String payToIndex) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement payTo = wait.until(elementToBeClickable(By.xpath(".//*[@id='wallet-action-newissue']/div[2]/div[3]/div/div/div/a/span")));
        payTo.click();
        String xpathToPayTo = ".//*[@id='wallet-action-newissue']/div[2]/div[3]/div/div/div/div/ul/li[" + payToIndex + "]";
        scrollElementIntoViewByXpath(xpathToPayTo);
        driver.findElement(By.xpath(xpathToPayTo)).click();
    }

    private static void selectPayToNewAddress() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath(".//*[@id='wallet-action-newissue']/div[2]/div[4]/div/div/span/button")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.xpath(".//*[@id='wallet-action-newissue']/div[2]/div[4]/div/div/span/button")).click();
        verifyPopupMessageText("Address :", "New Address Created message not displayed ");
    }

    private static void enterQuantity(String quantity) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement qty = wait.until(elementToBeClickable(By.xpath(".//*[@id='wallet-action-newissue']/div[3]/div/input")));
        qty.clear();
        qty.sendKeys(quantity);
    }

    private static void enterAssetInstrument(String instrument) throws InterruptedException {
        try{
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement assetInstr = driver.findElement(By.cssSelector("input.form-control.instrument"));
            wait.until(visibilityOf(assetInstr));
            wait.until(elementToBeClickable(assetInstr));
            assetInstr.clear();
            assetInstr.sendKeys(instrument);
        }catch(Exception e){
            System.out.println("Asset Instrument field not ready " + e.getMessage());
            logger.warn("Asset Instrument field not ready ");
        }
    }

    private static void selectAssetIdentifierType(String identifierType) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-registerasset .form-control.m-b.chosen').val('" + identifierType + "').trigger('chosen:updated').trigger('change')");
    }

    private static void enterAssetIdentifier(String identifier) {
        driver.findElement(By.cssSelector("input.form-control.identifier")).clear();
        driver.findElement(By.cssSelector("input.form-control.identifier")).sendKeys(identifier);
    }

    private static void enterAssetShortName(String assetShortName) {
        driver.findElement(By.cssSelector("input.form-control.shortName")).clear();
        driver.findElement(By.cssSelector("input.form-control.shortName")).sendKeys(assetShortName);
    }

    private static void enterAssetFullName(String assetFullName) {
        driver.findElement(By.cssSelector("input.form-control.fullName")).clear();
        driver.findElement(By.cssSelector("input.form-control.fullName")).sendKeys(assetFullName);
    }

    private static void enterCompanyName(String companyName) {
        driver.findElement(By.cssSelector("input.form-control.companyName")).clear();
        driver.findElement(By.cssSelector("input.form-control.companyName")).sendKeys(companyName);
    }

    private static void enterCompanyNumber(String companyNumber) {
        driver.findElement(By.cssSelector("input.form-control.companyNum")).clear();
        driver.findElement(By.cssSelector("input.form-control.companyNum")).sendKeys(companyNumber);
    }

    private static void selectAssetType(String assetType) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-registerasset .form-control.m-b.chosen').val('" + assetType + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectAssetDenomination(String denomination) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-registerasset .form-control.m-b.chosen').val('" + denomination + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectDistributionIssue(String distribution) {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-distribution .form-control.m-b.chosen.issue.asset').val('" + distribution + "').trigger('chosen:updated').trigger('change')");
    }

    private static void selectDistribution(String distribution) {
         ((JavascriptExecutor) driver).executeScript("$('#wallet-action-distribution .form-control.m-b.chosen.distribution.asset').val('" + distribution + "').trigger('chosen:updated').trigger('change')");
    }

    private static void enterPayQuantity(String payQuantity) {
        driver.findElement(By.cssSelector("input.form-control.payquantity")).clear();
        driver.findElement(By.cssSelector("input.form-control.payquantity")).sendKeys(payQuantity);
    }

    private static void populateIssuerFields(String issuer, String receiverIndex) throws InterruptedException {
        enterIssuerIdentification(issuer);
        selectIssuerReceivingWallet(receiverIndex);
    }

    private static void populateIssuerWithNewAddressFields(String issuer) throws InterruptedException {
        enterIssuerIdentification(issuer);
        createNewIssuerReceivingAddress();
    }

    private static void enterIssuerIdentification(String issuer) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement issuerIdentifier = wait.until(elementToBeClickable(By.cssSelector("input.form-control.registerissuer_id")));
        issuerIdentifier.click();
        issuerIdentifier.clear();
        issuerIdentifier.sendKeys(issuer);
    }

    public static void navigateToSearchRelationshipsTab() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement relnSearch = driver.findElement(By.xpath(".//*[@id='leiRelationship-search']/a/span"));
                wait.until(visibilityOf(relnSearch));
                wait.until(elementToBeClickable(relnSearch));
                relnSearch.click();
    }

    public static void navigateToAddNewRelationshipsTab() throws InterruptedException {

        WebElement relationshipTab = driver.findElement(By.xpath(".//*[@id='wallets-tabs']/ul/li[3]/a"));
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(relationshipTab));
            wait.until(elementToBeClickable(relationshipTab));
            relationshipTab.click();
        } catch (TimeoutException t) {
            System.out.println("Relationship Tab was not ready " + t.getMessage());
        } catch (ElementNotVisibleException v) {
            System.out.println("Relationship Tab was not visible " + v.getMessage());
        } catch (NoSuchElementException n) {
            System.out.println("Add New Relationship Tab was not present " + n.getMessage());
        } catch (ElementNotSelectableException s) {
            System.out.println("Relationship Tab was not clickable " + s.getMessage());
        }

        WebElement addNewRelationshipTab = driver.findElement(By.xpath(".//*[@id='leiRelationships-tabs']/ul/li[2]/a"));
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            wait.until(visibilityOf(addNewRelationshipTab));
            wait.until(elementToBeClickable(addNewRelationshipTab));
            addNewRelationshipTab.click();
        } catch (TimeoutException t) {
            System.out.println("Add New Relationship Tab was not ready " + t.getMessage());
        } catch (ElementNotVisibleException v) {
            System.out.println("Relationship Tab was not visible " + v.getMessage());
        } catch (NoSuchElementException n) {
            System.out.println("Add New Relationship Tab was not present " + n.getMessage());
        }catch (ElementNotSelectableException v) {
            System.out.println("Add New Relationship Tab was not clickable" + v.getMessage());
        }
        }

    public static void navigateToActionsTab() throws InterruptedException {
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement actionsTab = driver.findElement(By.xpath(".//*[@id='wallets-tabs']/ul/li[4]/a/span"));
            wait.until(visibilityOf(actionsTab));
            wait.until(elementToBeClickable(actionsTab));
            actionsTab.click();
        } catch (TimeoutException e){
            System.out.println("Actions Tab was not ready " + e);
        } catch (ElementNotVisibleException e){
            System.out.println("Actions Tab was not visible " + e);
        } catch (ElementNotSelectableException e){
            System.out.println("Actions Tab was not clickable " + e);
        }
    }

    private static void selectMessage() throws InterruptedException {
        driver.findElement(By.cssSelector("span.label-walletName")).click();
    }

    private static void verifyMessageSender(String sender) throws InterruptedException {
        assertEquals("Subject: Request from " + sender + "", driver.findElement(By.xpath("//div[@id='user-mail-view']/div/div[2]/h3")).getText());
    }

    private static void decryptAndAuthenticate() throws InterruptedException {
        driver.findElement(By.xpath("(//button[@type='button'])[170]")).click();
    }

    private static void checkAuthentication(String sender) throws InterruptedException {
        assertEquals("Authenticated    " + sender + "", driver.findElement(By.cssSelector("div.alert.alert-success")).getText());
    }

    private static void approveRequest() throws InterruptedException {
        try {
            assertTrue(isElementPresent(By.xpath("(//button[@type='button'])[170]")));
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
        driver.findElement(By.xpath("(//button[@type='button'])[170]")).click();
    }

    private static void navigateToRequestTab() {
        driver.findElement(By.xpath(".//*[@id='wallets-tabs']/ul/li[2]/a/i")).click();
    }

    private static void selectSenderWallet(String senderIndex) {
        ((JavascriptExecutor) driver).executeScript("$('#leiRelationship-tab-2  .chosen-select.senderWallet').val('" + senderIndex + "').trigger('chosen:updated')");
    }

    private static void selectReceivingWallet(String address) {
        ((JavascriptExecutor) driver).executeScript("$('#leiRelationship-tab-2  .chosen-select.receivingAddress.ownedAddressSelect.form-control')" +
                ".val('" + address + "').trigger('chosen:updated')");
    }

    private static void confirmMessageStatus(String status) {
        try {
            assertEquals(status, driver.findElement(By.cssSelector("div.col-sm-9 > span.label.label-primary")).getText());
        } catch (Error e) {
            verificationErrors.append(e.toString());
        }
    }

    public static void selectAndHandleRequestMessage(String sender, String status) throws InterruptedException {
        selectMessage();
        verifyMessageSender(sender);
        decryptAndAuthenticate();
        checkAuthentication(sender);
        approveRequest();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
        confirmMessageStatus(status);
    }

    public static void confirmBalance(String balance) throws InterruptedException {
        navigateToAddressesTab();
        waitForAddressesTabToLoad();
        selectNewTabToNavigateTo("balances");
        waitForBalancesTabToLoad();
        assertEquals(balance, driver.findElement(By.cssSelector("td.total")).getText());
    }

    public static void waitForAddressesTabToLoad() {
        WebElement addressesSortButton = driver.findElement(By.xpath("//div[@id='home-addresses-tab']/div/div/div/div/button"));
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOf(addressesSortButton));
    }

    private static void waitForBalancesTabToLoad() {
        WebElement newBalancesTab = driver.findElement(By.cssSelector("td.total"));
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOf(newBalancesTab));
    }

    private static void selectIssuerReceivingWallet(String receiverIndex) {
        driver.findElement(By.xpath(".//*[@id='wallet-action-registerissuer']/div[2]/div/div/a/span")).click();
        String xpathToAddress = ".//*[@id='wallet-action-registerissuer']/div[2]/div/div/div/ul/li[" + receiverIndex + "]";
        scrollElementIntoViewByXpath(xpathToAddress);
        driver.findElement(By.xpath(xpathToAddress)).click();
    }

    public static void requestCashFromPaymentBank() throws InterruptedException {
        navigateToRequestTab();
        selectRequestAsset();
    }

    private static void selectRequestAsset() throws InterruptedException {
        populateRequestAssetFields("Payment_Bank1_Issuer2|GBP", "1", "1", "1000000");
    }

    public static void createRelationship(String sender, String receiver) throws Exception {
        navigateToAddNewRelationshipsTab();
        populateNewRelationshipFieldsWithExistingAddress(sender, receiver);
    }

    public static void createRelationship(String sender) throws Exception {
        navigateToAddNewRelationshipsTab();
        populateNewRelationshipFieldsWithNewAddress(sender);
    }

    private static void createNewReceivingAddress() throws InterruptedException {
        scrollElementIntoViewByXpath(".//*[@id='leiRelationship-tab-2']/div/form/div/div[3]/div/span/button");
        WebElement receivingAddress = null;
        try {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        receivingAddress = driver.findElement(By.xpath(".//*[@id='leiRelationship-tab-2']/div/form/div/div[3]/div/span/button"));
            wait.until(visibilityOf(receivingAddress));
            wait.until(elementToBeClickable(receivingAddress));
            receivingAddress.click();
        }catch (TimeoutException t){
            System.out.println("Create Address Button was not ready" + t.getMessage());
        }catch (NoSuchElementException n){
            System.out.println("Create Address Button was not present" + n.getMessage());
        }catch (ElementNotVisibleException v){
            System.out.println("Create Address Button was not visible" + v.getMessage());
        }catch (ElementNotSelectableException s){
            System.out.println("Create Address Button was not clickable" + s.getMessage());
        }
        verifyPopupMessageText("Address :", "New Receiving Address Created message not displayed ");
    }

    private static void createNewContractCreatorAddress() throws InterruptedException {
        scrollElementIntoViewByXpath("(//button[@type='button'])[195]");
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        WebElement contractCreatorAddress = wait.until(elementToBeClickable(By.xpath("(//button[@type='button'])[195]")));
        contractCreatorAddress.click();
    }

    private static void createNewIssuerReceivingAddress() throws InterruptedException {
        scrollElementIntoViewByXpath(".//*[@id='wallet-action-registerissuer']/div[2]/div/span/button");
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement issuerReceivingAddress = driver.findElement(By.xpath(".//*[@id='wallet-action-registerissuer']/div[2]/div/span/button"));
            wait.until(visibilityOf(issuerReceivingAddress));
            wait.until(elementToBeClickable(issuerReceivingAddress));
            issuerReceivingAddress.click();
        } catch (TimeoutException t) {
            System.out.println("Address button was not ready " + t.getMessage());
        } catch (NoSuchElementException n) {
            System.out.println("Address button was not present " + n.getMessage());
        } catch (ElementNotVisibleException v) {
            System.out.println("Address button was not visible " + v.getMessage());
        } catch (ElementNotSelectableException s){
            System.out.println("Address button was not clickable " + s.getMessage());
        }
        verifyPopupMessageText("Address :", "New Issuer Receiving Address Created message not displayed ");
    }

    private static void submitRelationshipDetails(String alertText, String failText, String type) throws Exception {
       try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement submitRelnButton = driver.findElement(By.xpath(".//*[@id='leiRelationship-tab-2']/div/form/div/div[4]/div/button"));
            wait.until(visibilityOf(submitRelnButton));
            wait.until(elementToBeClickable(submitRelnButton));
            submitRelnButton.click();
       } catch (TimeoutException t){
           System.out.println("Submit Button was not ready " + t.getMessage());
       } catch (NoSuchElementException n){
           System.out.println("Submit Button was not present " + n.getMessage());
       } catch (ElementNotVisibleException v){
           System.out.println("Submit Button was not visible " + v.getMessage());
       } catch (ElementNotSelectableException s) {
           System.out.println("Submit Button was not clickable " + s.getMessage());
       } catch (ElementNotInteractableException i) {
           System.out.println("Submit Button was not interactable " + i.getMessage());
       }
       verifyPopupMessageText(alertText, failText);
    }

    private static void submitRequestDetails() {
        scrollElementIntoViewById("requestbutton");
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement reqButton = driver.findElement(By.id("requestbutton"));
            wait.until(visibilityOf(reqButton));
            wait.until(elementToBeClickable(reqButton));
            reqButton.click();
        } catch (TimeoutException t) {
            System.out.println("Submit Button was not ready " + t.getMessage());
        } catch (NoSuchElementException n) {
            System.out.println("Submit Button was not clickable " + n.getMessage());
        } catch (ElementNotVisibleException v) {
            System.out.println("Submit Button was not visible " + v.getMessage());
        } catch (ElementNotSelectableException s) {
            System.out.println("Submit Button was not clickable " + s.getMessage());
        } catch (ElementNotInteractableException i) {
            System.out.println("Submit Button was not interactable " + i.getMessage());
        }
    }

    public static void executeAction() throws InterruptedException {
        scrollElementIntoViewById("action_execute");
        try {
            WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
            WebElement executeActionButton = driver.findElement(By.id("action_execute"));
            wait.until(visibilityOf(executeActionButton));
            wait.until(elementToBeClickable(executeActionButton));
            executeActionButton.click();
        } catch (TimeoutException t){
            System.out.println("Execute Action Button was not ready " + t.getMessage());
        } catch (NoSuchElementException n){
            System.out.println("Execute Action Button was not present " + n.getMessage());
        } catch (ElementNotSelectableException s){
            System.out.println("Execute Action Button was not clickable " + s.getMessage());
        } catch (ElementNotVisibleException v){
            System.out.println("Execute Action Button was not ready " + v.getMessage());
        } catch (ElementNotInteractableException i){
            System.out.println("Execute Action Button was not interactable " + i.getMessage());
        }
    }

    public static String generateRandomIssuerName()
    {
        String name = RandomStringUtils.randomAlphanumeric(6);
        String issuerName = "Test_Issuer_" + name;
        return issuerName;
    }

    public static String generateRandomInstrumentName()
    {
        String name = RandomStringUtils.randomAlphanumeric(6);
        String instrumentName = "Test_Instrument_" + name;
        return instrumentName;
    }

    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private static boolean isElementDisabled(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    private void takeScreenShot(String fname) throws Exception {
        File scrFile = ((TakesScreenshot) SetUp.driver).getScreenshotAs(OutputType.FILE);
        String OS = System.getProperty("os.name");
        String dir;
        if (OS.equals("Mac OS X")) {
            dir = "/Users/billmackie/Downloads/Screenshots//";
        } else {
            dir = "/var/lib/jenkins/workspace/OpenCSDAcceptanceTest/setlOpenCSDUITests/target/test-attachments//";
        }
        String userDirectory = dir;
        FileUtils.copyFile(scrFile, new File(userDirectory, fname));
    }
}
