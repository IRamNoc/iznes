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
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(fundDetails);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage()); }
        WebDriverWait waiting = new WebDriverWait(driver, timeoutInSeconds);
        waiting.until(visibilityOfElementLocated(By.id("buttonSelectFund")));
        waiting.until(elementToBeClickable(By.id("buttonSelectFund")));
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
        driver.findElement(By.id("fundShareName")).clear();
        driver.findElement(By.id("fundShareName")).sendKeys(shareName);
        driver.findElement(By.id("shareLaunchDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("shareLaunchDate")).sendKeys(Keys.ESCAPE);
        driver.findElement(By.id("subscriptionStartDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("subscriptionStartDate")).sendKeys(Keys.ESCAPE);
        driver.findElement(By.id("isin")).clear();
        driver.findElement(By.id("isin")).sendKeys(isin);
        driver.findElement(By.id("shareClassCode")).sendKeys("share class");
        driver.findElement(By.id("shareClassCode")).sendKeys("share class");
        openDropdownAndSelectOption("shareClassCurrency", 1);
        openDropdownAndSelectOption("shareClassInvestmentStatus", 1);
        openDropdownAndSelectOption("status", 1);
        openDropdownAndSelectOption("valuationFrequency", 3);
        driver.findElement(By.id("hasCoupon")).click();
        openDropdownAndSelectOption("valuationFrequency", 3);
        scrollElementIntoViewById("couponType");
        wait.until(visibilityOfAllElementsLocatedBy(By.id("couponType")));
        wait.until(elementToBeClickable(By.id("couponType")));
        openDropdownAndSelectOption("couponType", 1);
        openDropdownAndSelectOption("freqOfDistributionDeclaration", 1);
        assertClassRequiredIsPresent("tabKeyFactsButton");
        openDropdownAndSelectOption("historicOrForwardPricing", 1);
        openDropdownAndSelectOption("sharePortfolioCurrencyHedge", 1);
        assertHiddenAttributeIsPresent("tabKeyFactsButton");
    }

    public static void shareCreationCharacteristics() throws SQLException, InterruptedException {

        try {
            driver.findElement(By.id("tabCharacteristicsButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleCharacteristicMandatory")).isDisplayed());
        driver.findElement(By.id("maximumNumDecimal")).clear();
        driver.findElement(By.id("maximumNumDecimal")).sendKeys("1991");
        openDropdownAndSelectOption("subscriptionCategory", 1);
        driver.findElement(By.id("minInitialSubscriptionInShare")).clear();
        driver.findElement(By.id("minInitialSubscriptionInShare")).sendKeys("5");
        driver.findElement(By.id("minSubsequentSubscriptionInShare")).clear();
        driver.findElement(By.id("minSubsequentSubscriptionInShare")).sendKeys("5");
        openDropdownAndSelectOption("redemptionCategory", 1);
        driver.findElement(By.id("minInitialRedemptionInShare")).clear();
        driver.findElement(By.id("minInitialRedemptionInShare")).sendKeys("5");
        assertClassRequiredIsPresent("tabCharacteristicsButton");
        driver.findElement(By.id("minSubsequentRedemptionInShare")).clear();
        driver.findElement(By.id("minSubsequentRedemptionInShare")).sendKeys("5");
        assertHiddenAttributeIsPresent("tabCharacteristicsButton");

    }

    public static void shareCreationCalendar() throws SQLException, InterruptedException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        try {
            driver.findElement(By.id("tabCalendarButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleCalendarMandatory")).isDisplayed());
        openDropdownAndSelectOption("subscriptionTradeCyclePeriod", 1);
        openDropdownAndSelectOption("redemptionTradeCyclePeriod", 1);

        setTime("12:12", "subscriptionCutOffTime");


        openDropdownAndSelectOption("subscriptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForSubscription", 1);

        setTime("13:13", "redemptionCutOffTime");

        openDropdownAndSelectOption("redemptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForRedemption", 1);
        scrollElementIntoViewById("cancelFundShareBottom");
        wait.until(visibilityOfElementLocated(By.id("cancelFundShareBottom")));
        wait.until(elementToBeClickable(By.id("cancelFundShareBottom")));
        openDropdownAndSelectOption("subscriptionSettlementPeriod", 1);
        openDropdownAndSelectOption("redemptionSettlementPeriod", 1);
        assertClassRequiredIsPresent("tabCalendarButton");
        driver.findElement(By.id("subscriptionRedemptionCalendar")).clear();
        driver.findElement(By.id("subscriptionRedemptionCalendar")).sendKeys("testCalendar");
        assertHiddenAttributeIsPresent("tabCalendarButton");

    }

    public static void shareCreationFees() throws SQLException, InterruptedException {

        try {
            driver.findElement(By.id("tabFeesButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
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
        assertClassRequiredIsPresent("tabFeesButton");
        driver.findElement(By.id("mifiidIncidentalCosts")).clear();
        driver.findElement(By.id("mifiidIncidentalCosts")).sendKeys("1");
        assertHiddenAttributeIsPresent("tabFeesButton");

    }

    public static void shareCreationProfile() throws SQLException, InterruptedException {

        try {
            driver.findElement(By.id("tabProfileButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleProfileMandatory")).isDisplayed());
        assertClassRequiredIsPresent("tabProfileButton");
        openDropdownAndSelectOption("investorProfile", 1);
        assertHiddenAttributeIsPresent("tabProfileButton");

    }

    public static void shareCreationSubmit() {
        WebDriverWait waits = new WebDriverWait(driver, timeoutInSeconds);

        try {
            scrollElementIntoViewById("saveFundShareBottom");
            waits.until(visibilityOfElementLocated(By.id("saveFundShareBottom")));
            waits.until(elementToBeClickable(driver.findElement(By.id("saveFundShareBottom"))));
            driver.findElement(By.id("saveFundShareBottom")).click();
        }catch (Exception e){
            System.out.println("fail " + e.getMessage());
        }
        waits.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
        String popupSubheading = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(popupSubheading.equals("Info!"));
        waits.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
    }

}
