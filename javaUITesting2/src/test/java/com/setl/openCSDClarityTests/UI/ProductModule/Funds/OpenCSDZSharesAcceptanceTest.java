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

import java.io.IOException;
import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.isElementPresent;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDZSharesAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(45000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);



    @Before
    public void setUp() throws Exception {
        testSetUp();

        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldCreateShare() throws IOException, InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-product-home");
        try {
            driver.findElement(By.id("new-share-btn")).click();
        }catch (Error e){
            fail(e.getMessage());
        }
        Thread.sleep(1750);
        try {
            String shareTitle = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-0\"]/h3")).getText();
            assertTrue(shareTitle.equals("Please enter following information to create a new Fund Share:"));
        }catch (Error e){
            fail(e.getMessage());
        }
        openDropdownAndSelectOption("selectFund", 1);
        driver.findElement(By.id("buttonSelectFund")).click();
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
        assertClassRequiredIsPresent("tabKeyFactsButton");
        openDropdownAndSelectOption("historicOrForwardPricing", 2);
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
//        assertClassRequiredIsPresent("tabFeesButton");
//        openDropdownAndSelectOption("investorProfile", 1);
//        assertHiddenAttributeIsPresent("tabFeesButton");
    }

    public static void openDropdownAndSelectOption(String dropdownID, int childNo) throws SQLException, InterruptedException {
        driver.findElement(By.id(dropdownID)).click();
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
            assertFalse(driver.findElement(By.xpath("//*[@id=\'" + tabID + "\']/span/span")).isDisplayed());
        }catch (Exception e){ fail("Asterisk was present " + e.getMessage()); }
    }


}
