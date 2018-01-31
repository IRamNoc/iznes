package com.setl.UI.common.SETLUIHelpers;

import junit.framework.TestCase;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.io.IOException;
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

    public static void selectRegisterAsset() throws InterruptedException {
       ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('registerAsset').trigger('chosen:updated').click().trigger('change')");
    }

    public static void actionRegisterAsset(String instrument, String identifierType, String identifier,
                                           String assetShortName, String assetFullName, String companyName,
                                           String companyNumber,  String assetType,
                                           String denomination) throws InterruptedException {

        populateRegisterAssetFields(instrument, identifierType, identifier, assetShortName, assetFullName, companyName, companyNumber, assetType, denomination);
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
    }

    public static void selectNewIssue() throws InterruptedException {
        ((JavascriptExecutor) driver).executeScript("$('#wallet-action-select.form-control.m-b.chosen').val('newIssue').trigger('chosen:updated').click().trigger('change')");
    }

    public static void actionNewIssueWithOwnedAddress(String issueIndex, String qty, String recipientType, String recipientType1) throws InterruptedException {
        populateNewIssueWithNewOwnedAddress(issueIndex, qty, recipientType, recipientType1);
        executeAction();
        verifyPopupMessageText("Transaction :", "Action executed message not displayed ");
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

    private static boolean isElementPresent(By by) {

        try {
            driver.findElement(by);
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }

  public static void verifyPopupMessageText(String alertText, String failText) throws InterruptedException {
    try {
      WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
      wait.until(visibilityOfElementLocated(By.className("jaspero__dialog")));
      wait.until(elementToBeClickable(driver.findElement(By.cssSelector("default ng-tns-c16-3"))));
    }catch (TimeoutException t) {
      System.out.println(failText + "Timed Out  " + t.getMessage());
    }catch (NoSuchElementException n) {
      System.out.println(failText + "Popup not present  " + n.getMessage());
    }catch (ElementNotVisibleException v) {
      System.out.println(failText + "Popup not visible  " + v.getMessage());
    }catch (ElementNotSelectableException s) {
      System.out.println(failText + "Confirm button not ready  " + s.getMessage());
    }
    try {
      WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
      wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
      if (!(driver.findElement(By.className("jaspero__dialog-title")).getText().contains(alertText))) {
        Assert.fail("Actual message was : " + (driver.findElement(By.cssSelector(SweetAlert)).getText() + " " + (driver.findElement(By.cssSelector((SweetAlertHeader))).getText())));
      }
    }catch (Exception e)
    {
      System.out.println("No Text present " + e.getMessage());
      TestCase.fail();
    }
    driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
  }
}
