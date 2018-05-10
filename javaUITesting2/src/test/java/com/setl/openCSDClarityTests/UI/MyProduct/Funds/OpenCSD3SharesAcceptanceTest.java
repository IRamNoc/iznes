package com.setl.openCSDClarityTests.UI.MyProduct.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.security.Key;
import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewFundShareTitle;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.invisibilityOfElementLocated;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSD3SharesAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(60000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);



    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBToProdOff();
    }

    @After
    public void tearDown() throws Exception {
        setDBToProdOn();
    }

    @Test
    //@Ignore("Wont work until we have a solution for documents fields")
    public void shouldCreateShare() throws IOException, InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String shareCountXpathPre = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPre = Integer.parseInt(shareCountXpathPre.replaceAll("[\\D]", ""));

        waitForNewShareButton();
        waitForNewFundShareTitle();
        openDropdownAndSelectOption("selectFund", 1);
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        wait.until(visibilityOfElementLocated(By.id("buttonSelectFund")));
        wait.until(elementToBeClickable(By.id("buttonSelectFund")));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("tabFundShareButton")).isDisplayed());
        }catch (Exception e){
            fail("not present");
        }

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        driver.findElement(By.id("fundShareName")).sendKeys(uFundDetails[0]);
        driver.findElement(By.id("shareLaunchDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("shareLaunchDate")).sendKeys(Keys.ESCAPE);
        driver.findElement(By.id("subscriptionStartDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("subscriptionStartDate")).sendKeys(Keys.ESCAPE);
        driver.findElement(By.id("isin")).sendKeys(uIsin[0]);
        driver.findElement(By.id("shareClassCode")).sendKeys("share class");
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
        openDropdownAndSelectOption("sharePortfolioCurrencyHedge", 1);
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
        driver.findElement(By.id("subscriptionCutOffTime")).sendKeys("1212");
        openDropdownAndSelectOption("subscriptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForSubscription", 1);
        driver.findElement(By.id("redemptionCutOffTime")).sendKeys("1313");
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
        //assertTrue(driver.findElement(By.id("toggleFeesMandatory")).isDisplayed());
        driver.findElement(By.id("maxManagementFee")).sendKeys("1");
        driver.findElement(By.id("maxSubscriptionFee")).sendKeys("1");
        driver.findElement(By.id("maxRedemptionFee")).sendKeys("1");
        driver.findElement(By.id("mifiidChargesOngoing")).sendKeys("1");
        driver.findElement(By.id("mifiidChargesOneOff")).sendKeys("1");
        driver.findElement(By.id("mifiidTransactionCosts")).sendKeys("1");
        driver.findElement(By.id("mifiidServicesCosts")).sendKeys("1");
        assertClassRequiredIsPresent("tabFeesButton");
        driver.findElement(By.id("mifiidIncidentalCosts")).sendKeys("1");
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
        WebDriverWait waits = new WebDriverWait(driver, timeoutInSeconds);
        try {
            scrollElementIntoViewById("saveFundShareBottom");
            waits.until(visibilityOfElementLocated(By.id("saveFundShareBottom")));
            waits.until(elementToBeClickable(driver.findElement(By.id("saveFundShareBottom"))));
            driver.findElement(By.id("saveFundShareBottom")).click();
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        waits.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
        String popupSubheading = driver.findElement(By.className("jaspero__dialog-title")).getText();
        System.out.println(popupSubheading);
        assertTrue(popupSubheading.equals("Info!"));
        waits.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));

        String shareCountXpathPost = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPost = Integer.parseInt(shareCountXpathPost.replaceAll("[\\D]", ""));
        System.out.println(shareCountPre + " Shares are in the listings before");
        System.out.println(shareCountPost + " Shares are in the listings after");

        assertTrue(shareCountPost == shareCountPre + 1);

    }

}
