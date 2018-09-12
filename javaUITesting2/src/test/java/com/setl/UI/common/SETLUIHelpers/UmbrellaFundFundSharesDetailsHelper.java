package com.setl.UI.common.SETLUIHelpers;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.assertClassRequiredIsPresent;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.assertHiddenAttributeIsPresent;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.openDropdownAndSelectOption;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.setTime;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;

public class UmbrellaFundFundSharesDetailsHelper {

    public static void createShare(String fundDetails, String shareDetails, String isinDetails) throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        waitForNewShareButton();
        driver.findElement(By.xpath("//*[@id='selectFund']/div")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        wait.until(refreshed(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(fundDetails);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage()); }
        WebDriverWait waiting = new WebDriverWait(driver, timeoutInSeconds);
        waiting.until(refreshed(visibilityOfElementLocated(By.id("buttonSelectFund"))));
        waiting.until(refreshed(elementToBeClickable(By.id("buttonSelectFund"))));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("tabFundShareButton")).isDisplayed());
        } catch (Exception e){fail("not present"); }
        shareCreationKeyFacts(shareDetails,isinDetails);
        shareCreationCharacteristics();
        shareCreationCalendar();
        shareCreationFees();
        shareCreationProfile();
        shareCreationSubmit();
    }

    public static void createShareWithoutCharacteristics(String fundDetails, String shareDetails, String isinDetails) throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        waitForNewShareButton();
        driver.findElement(By.xpath("//*[@id='selectFund']/div")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        wait.until(refreshed(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(fundDetails);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage()); }
        WebDriverWait waiting = new WebDriverWait(driver, timeoutInSeconds);
        waiting.until(refreshed(visibilityOfElementLocated(By.id("buttonSelectFund"))));
        waiting.until(refreshed(elementToBeClickable(By.id("buttonSelectFund"))));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("tabFundShareButton")).isDisplayed());
        } catch (Exception e){fail("not present"); }
    }

    public static void createShareFromYesPopup(String fundDetails, String shareDetails, String isinDetails) throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath("//*[@id='selectFund']/div")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        wait.until(refreshed(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(fundDetails);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage()); }
        WebDriverWait waiting = new WebDriverWait(driver, timeoutInSeconds);
        waiting.until(refreshed(visibilityOfElementLocated(By.id("buttonSelectFund"))));
        waiting.until(refreshed(elementToBeClickable(By.id("buttonSelectFund"))));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("tabFundShareButton")).isDisplayed());
        } catch (Exception e){fail("not present"); }
        shareCreationKeyFacts(shareDetails,isinDetails);
        shareCreationCharacteristics();
        shareCreationCalendar();
        shareCreationFees();
        shareCreationProfile();
        shareCreationSubmit();
    }

    public static void shareCreationKeyFacts(String shareName, String isin) throws SQLException, InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        assertTrue(driver.findElement(By.id("fundShareName")).isDisplayed());

        driver.findElement(By.id("fundShareName")).clear();
        driver.findElement(By.id("fundShareName")).sendKeys(shareName);
        driver.findElement(By.id("isin")).sendKeys(isin);
        openDropdownAndSelectOption("shareClassInvestmentStatus", 1);
        openDropdownAndSelectOption("shareClassCurrency", 1);
        driver.findElement(By.id("shareClassCode")).clear();
        driver.findElement(By.id("shareClassCode")).sendKeys("share class");
        scrollElementIntoViewById("subscriptionStartDate");
        Thread.sleep(1000);
        driver.findElement(By.id("shareLaunchDate")).click();
        driver.findElement(By.cssSelector("form.ng-invalid > section:nth-child(1) > div:nth-child(1) > div:nth-child(7) > div:nth-child(2) > dp-date-picker:nth-child(3) > div:nth-child(2) > div:nth-child(1) > dp-day-calendar:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button:nth-child(2)")).click();
        driver.findElement(By.id("subscriptionStartDate")).click();
        driver.findElement(By.cssSelector("form.ng-invalid > section:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(2) > dp-date-picker:nth-child(3) > div:nth-child(2) > div:nth-child(1) > dp-day-calendar:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button:nth-child(2)")).click();
        driver.findElement(By.id("iban")).clear();
        driver.findElement(By.id("iban")).sendKeys(isin + "33");
        driver.findElement(By.xpath("//*[@id=\"status\"]/div")).click();
        driver.findElement(By.xpath("//*[@id=\"status\"]/div/div[3]/ul/li[1]/div/a")).click();
        scrollElementIntoViewById("status");
        Thread.sleep(1000);
        scrollElementIntoViewById("hasCoupon");
        scrollElementIntoViewById("cancelFundShareBottom");
        Thread.sleep(500);
        wait.until(refreshed(visibilityOfElementLocated(By.id("cancelFundShareBottom"))));
        wait.until(refreshed(elementToBeClickable(By.id("cancelFundShareBottom"))));
        openDropdownAndSelectOption("valuationFrequency", 3);
        driver.findElement(By.id("hasCoupon")).click();
        openDropdownAndSelectOption("valuationFrequency", 3);
        scrollElementIntoViewById("couponType");
        wait.until(visibilityOfAllElementsLocatedBy(By.id("couponType")));
        wait.until(refreshed(elementToBeClickable(By.id("couponType"))));
        openDropdownAndSelectOption("couponType", 1);
        openDropdownAndSelectOption("freqOfDistributionDeclaration", 1);
        openDropdownAndSelectOption("historicOrForwardPricing", 1);
        openDropdownAndSelectOption("sharePortfolioCurrencyHedge", 1);
    }

    public static void shareCreationCharacteristics() throws SQLException, InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewById("tabFundShareButton");
        wait.until(refreshed(visibilityOfElementLocated(By.id("tabFundShareButton"))));
        scrollElementIntoViewById("tabFundShareButton");

        Thread.sleep(500);
        driver.findElement(By.id("tabCharacteristicsButton")).click();

        assertTrue(driver.findElement(By.id("maximumNumDecimal")).isDisplayed());

        driver.findElement(By.id("maximumNumDecimal")).clear();
        driver.findElement(By.id("maximumNumDecimal")).sendKeys("5");
        scrollElementIntoViewById("nextTab");
        openDropdownAndSelectOption("subscriptionCategory", 1);
        driver.findElement(By.id("minInitialSubscriptionInShare")).clear();
        driver.findElement(By.id("minInitialSubscriptionInShare")).sendKeys("5");
        driver.findElement(By.id("minSubsequentSubscriptionInShare")).clear();
        driver.findElement(By.id("minSubsequentSubscriptionInShare")).sendKeys("5");
        openDropdownAndSelectOption("redemptionCategory", 1);
        driver.findElement(By.id("minSubsequentRedemptionInShare")).clear();
        driver.findElement(By.id("minSubsequentRedemptionInShare")).sendKeys("5");
        openDropdownAndSelectOption("redemptionCategory", 1);

    }

    public static void shareCreationCalendar() throws SQLException, InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            scrollElementIntoViewById("tabFundShareButton");
            wait.until(refreshed(visibilityOfElementLocated(By.id("tabFundShareButton"))));
            driver.findElement(By.id("tabCalendarButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }

        assertTrue(driver.findElement(By.id("subscriptionTradeCyclePeriod")).isDisplayed());

        openDropdownAndSelectOption("subscriptionTradeCyclePeriod", 1);
        openDropdownAndSelectOption("redemptionTradeCyclePeriod", 1);
        setTime("12:12", "subscriptionCutOffTime");
        openDropdownAndSelectOption("subscriptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForSubscription", 1);
        setTime("13:13", "redemptionCutOffTime");
        scrollElementIntoViewById("cancelFundShareBottom");
        Thread.sleep(500);
        wait.until(refreshed(visibilityOfElementLocated(By.id("cancelFundShareBottom"))));
        wait.until(refreshed(elementToBeClickable(By.id("cancelFundShareBottom"))));
        openDropdownAndSelectOption("redemptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForRedemption", 1);
        scrollElementIntoViewById("cancelFundShareBottom");
        wait.until(refreshed(visibilityOfElementLocated(By.id("cancelFundShareBottom"))));
        wait.until(refreshed(elementToBeClickable(By.id("cancelFundShareBottom"))));
        openDropdownAndSelectOption("subscriptionSettlementPeriod", 1);
        openDropdownAndSelectOption("redemptionSettlementPeriod", 1);
    }

    public static void shareCreationFees() throws SQLException, InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            scrollElementIntoViewById("tabFundShareButton");
        }catch (Exception e){
            fail(e.getMessage());
        }

        wait.until(refreshed(visibilityOfElementLocated(By.id("tabFundShareButton"))));

        try {
            scrollElementIntoViewById("tabFundShareButton");
            wait.until(refreshed(elementToBeClickable(By.id("tabFundShareButton"))));
        }catch (Exception e){
            fail(e.getMessage());
        }

        Thread.sleep(500);

        try {
            driver.findElement(By.id("tabFeesButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }

        assertTrue(driver.findElement(By.id("maxManagementFee")).isDisplayed());

        driver.findElement(By.id("maxManagementFee")).clear();
        driver.findElement(By.id("maxManagementFee")).sendKeys("1");
        driver.findElement(By.id("maxSubscriptionFee")).clear();
        driver.findElement(By.id("maxSubscriptionFee")).sendKeys("1");
        driver.findElement(By.id("maxRedemptionFee")).clear();
        driver.findElement(By.id("maxRedemptionFee")).sendKeys("1");
        driver.findElement(By.id("mifiidChargesOngoing")).clear();
        driver.findElement(By.id("mifiidChargesOngoing")).sendKeys("1");
        driver.findElement(By.id("mifiidChargesOneOff")).clear();
        driver.findElement(By.id("mifiidChargesOneOff")).sendKeys("1");
        driver.findElement(By.id("mifiidTransactionCosts")).clear();
        driver.findElement(By.id("mifiidTransactionCosts")).sendKeys("1");
        driver.findElement(By.id("mifiidServicesCosts")).clear();
        driver.findElement(By.id("mifiidServicesCosts")).sendKeys("1");
        driver.findElement(By.id("mifiidIncidentalCosts")).clear();
        driver.findElement(By.id("mifiidIncidentalCosts")).sendKeys("1");

    }

    public static void shareCreationProfile() throws SQLException, InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            scrollElementIntoViewById("tabFundShareButton");
            wait.until(refreshed(visibilityOfElementLocated(By.id("tabFundShareButton"))));
            driver.findElement(By.id("tabProfileButton")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }
        assertTrue(driver.findElement(By.id("investorProfile")).isDisplayed());
        openDropdownAndSelectOption("investorProfile", 1);

    }

    public static void shareCreationSubmit() throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            scrollElementIntoViewById("saveFundShareBottom");
            wait.until(visibilityOfElementLocated(By.id("saveFundShareBottom")));
            wait.until(elementToBeClickable(driver.findElement(By.id("saveFundShareBottom"))));
            driver.findElement(By.id("saveFundShareBottom")).click();
        }catch (Exception e){
            System.out.println("fail " + e.getMessage());
        }
        //Thread.sleep(5000);
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
        String popupSubheading = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(popupSubheading.equals("Info!"));
        Thread.sleep(17500);
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
    }

    public static void assertPopupNextFundYes(String fundType) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        String test = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]/span")).getText();
        assertTrue(test.equals("Do You Want To Create A " + fundType + "?"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]")));
    }

    public static void assertPopupNextFundNo(String fundType) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        String test = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]/span")).getText();
        assertTrue(test.equals("Do You Want To Create A " + fundType + "?"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[1]")).click();
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]")));
    }

    public static void searchUmbrellaTable(String fundName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(fundName);
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[2]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button"));
    }

    public static void searchFundsTable(String fundName) {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button");
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(fundName);
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[3]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
    }

    public static void searchSharesTable(String shareName) throws InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.className("toast-title")));
        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        WebElement targetShare = (driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")));
        try {
            scrollElementIntoViewByXpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[5]/div[2]/div/clr-datagrid/div/div/div/clr-dg-footer/div");
        }catch (Exception e){
            fail(e.getMessage());}
        Thread.sleep(1000);
        try {
            targetShare.click();
            WebElement shareNameField = (driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")));
            shareNameField.clear();
            shareNameField.sendKeys(shareName);

            WebElement shareNameButton = (driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")));
            shareNameButton.click();
            wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")));
        } catch (Exception e) {
            e.printStackTrace();}
    }

    private static void scrollElementIntoViewByWebElement(WebElement targetShare) {
    }
}
