package com.setl.openCSDClarityTests.UI.ProductModule.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestRule;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewFundShareTitle;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDZSharesAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(300000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);



    @Before
    public void setUp() throws Exception {
        testSetUp();

        screenshotRule.setDriver(driver);
    }

    @Test
    @Ignore("Wont work until we have a solution for documents fields")
    public void shouldCreateShare() throws IOException, InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        waitForNewShareButton();
        waitForNewFundShareTitle();
        openDropdownAndSelectOption("selectFund", 1);
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("buttonSelectFund")));
        wait.until(elementToBeClickable(By.id("buttonSelectFund")));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("saveFundShareTop")).isDisplayed());
        }catch (Exception e){
            fail("not present");
        }
        driver.findElement(By.id("fundShareName")).sendKeys("TestShareName1");
        driver.findElement(By.id("isin")).sendKeys("6116");
        driver.findElement(By.id("subscriptionStartDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("launchDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("aumClass")).sendKeys("2");
        driver.findElement(By.id("nosClass")).sendKeys("2");
        driver.findElement(By.id("valuationNAV")).sendKeys("2");
        driver.findElement(By.id("aumClassDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("nosClassDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("valuationNAVDate")).sendKeys("2019-04-10");
        openDropdownAndSelectOption("shareClassCode", 1);
        openDropdownAndSelectOption("shareClassCurrency", 1);
        openDropdownAndSelectOption("shareClassInvestmentStatus", 1);
        openDropdownAndSelectOption("status", 1);
        openDropdownAndSelectOption("valuationFrequency", 3);
        driver.findElement(By.id("hasCoupon")).click();
        openDropdownAndSelectOption("valuationFrequency", 3);
        openDropdownAndSelectOption("couponType", 1);
        openDropdownAndSelectOption("freqOfDistributionDeclaration", 1);
        assertClassRequiredIsPresent("tabKeyFactsButton");
        openDropdownAndSelectOption("historicOrForwardPricing", 1);
        assertHiddenAttributeIsPresent("tabKeyFactsButton");
        //CHARACTERISTICS
        try {
            driver.findElement(By.id("tabCharacteristicsButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleCharacteristicMandatory")).isDisplayed());
        driver.findElement(By.id("maximumNumDecimal")).sendKeys("1991");
        openDropdownAndSelectOption("subscriptionCategory", 1);
        driver.findElement(By.id("minInitialSubscriptionInShare")).sendKeys("5");
        driver.findElement(By.id("minSubsequentSubscriptionInShare")).sendKeys("5");
        openDropdownAndSelectOption("redemptionCategory", 1);
        driver.findElement(By.id("minInitialRedemptionInShare")).sendKeys("5");
        assertClassRequiredIsPresent("tabCharacteristicsButton");
        driver.findElement(By.id("minSubsequentRedemptionInShare")).sendKeys("5");
        assertHiddenAttributeIsPresent("tabCharacteristicsButton");
        //CALENDAR
        try {
            driver.findElement(By.id("tabCalendarButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleCalendarMandatory")).isDisplayed());
        openDropdownAndSelectOption("subscriptionTradeCyclePeriod", 1);
        openDropdownAndSelectOption("redemptionTradeCyclePeriod", 1);
        driver.findElement(By.id("subscriptionCutOffTime")).sendKeys("testSubscription");
        openDropdownAndSelectOption("subscriptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForSubscription", 1);
        driver.findElement(By.id("redemptionCutOffTime")).sendKeys("testRedemption");
        openDropdownAndSelectOption("redemptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForRedemption", 1);
        openDropdownAndSelectOption("subscriptionSettlementPeriod", 1);
        openDropdownAndSelectOption("redemptionSettlementPeriod", 1);
        assertClassRequiredIsPresent("tabCalendarButton");
        driver.findElement(By.id("subscriptionRedemptionCalendar")).sendKeys("testCalendar");
        assertHiddenAttributeIsPresent("tabCalendarButton");
        //FEES
        try {
            driver.findElement(By.id("tabFeesButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleFeesMandatory")).isDisplayed());
        driver.findElement(By.id("maxManagementFee")).sendKeys("1");
        driver.findElement(By.id("maxSubscriptionFee")).sendKeys("1");
        driver.findElement(By.id("maxRedemptionFee")).sendKeys("1");
        driver.findElement(By.id("miFIDIIOngoingCharges")).sendKeys("1");
        driver.findElement(By.id("miFIDIIOneOffCharges")).sendKeys("1");
        driver.findElement(By.id("miFIDIITransactionsCosts")).sendKeys("1");
        driver.findElement(By.id("miFIDIIAncillaryCharges")).sendKeys("1");
        assertClassRequiredIsPresent("tabFeesButton");
        driver.findElement(By.id("miFIDIIIncidentalCosts")).sendKeys("1");
        assertHiddenAttributeIsPresent("tabFeesButton");
        //PROFILE
        try {
            driver.findElement(By.id("tabProfileButton")).click();
        }catch (Exception e){ fail(e.getMessage()); }
        assertTrue(driver.findElement(By.id("toggleProfileMandatory")).isDisplayed());
        assertClassRequiredIsPresent("tabProfileButton");
        openDropdownAndSelectOption("investorProfile", 1);
        assertHiddenAttributeIsPresent("tabProfileButton");
        //DOCUMENTS
        try {
            driver.findElement(By.id("tabDocumentsButton")).click();
        }catch(Exception e){
            fail(e.getMessage());
        }
        assertTrue(driver.findElement(By.id("toggleDocumentsMandatory")).isDisplayed());
        try {
            //driver.setFileDetector(new LocalFileDetector());
            driver.findElement(By.cssSelector("#prospectus")).sendKeys("/Users/jordanmiller/Downloads/121212.jpg");
            //driver.findElement(By.xpath("//*[@id=\"prospectus\"]")).sendKeys("/Users/jordanmiller/Downloads/121212.jpg");
        }catch (Exception e){
            fail(e.getMessage());
        }


    }

    public static void openDropdownAndSelectOption(String dropdownID, int childNo) throws SQLException, InterruptedException {
        driver.findElement(By.xpath("//*[@id='" + dropdownID + "']/div")).click();
        Thread.sleep(750);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(" + childNo + ") > div > a")).click();
        }catch (Exception e){
            fail("dropdown not selected. " + e.getMessage());
        }
    }
    public static void assertClassRequiredIsPresent(String tabID) throws SQLException, InterruptedException {
        try {
            assertTrue(driver.findElement(By.xpath("//*[@id=\'" + tabID + "\']/span/span")).isDisplayed());
        }catch (Exception e){ fail("Asterisk was present " + e.getMessage()); }
    }
    public static void assertHiddenAttributeIsPresent(String tabID) throws SQLException, InterruptedException {
        try {
            assertFalse(driver.findElement(By.xpath("//*[@id=\'" + tabID + "\']/span/span[2]")).isDisplayed());
        }catch (Exception e){ fail("Asterisk was present " + e.getMessage()); }
    }


}
