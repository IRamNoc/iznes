package com.setl.openCSDClarityTests.UI.MyProduct.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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
    public Timeout globalTimeout = new Timeout(6000000);
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
    public void shouldCreateShare() throws IOException, InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String fundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCount = Integer.parseInt(fundCountXpath.replaceAll("[\\D]", ""));

        String [] unFundDetails = generateRandomFundsDetails();
        fillOutFundDetailsStep1("none");
        fillOutFundDetailsStep2(unFundDetails[0]);

        //Assert fund table displays the information for the fund created previously, including umbFund
        getFundTableRow(fundCount, unFundDetails[0], "", "EUR Euro", "Management Company", "Afghanistan","Contractual Fund", "");

        String shareCountXpathPre = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPre = Integer.parseInt(shareCountXpathPre.replaceAll("[\\D]", ""));

        waitForNewShareButton();
        //waitForNewFundShareTitle();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        driver.findElement(By.xpath("//*[@id='selectFund']/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(unFundDetails[0]);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }

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
        driver.findElement(By.id("shareLaunchDate")).sendKeys(Keys.ENTER);
        driver.findElement(By.id("subscriptionStartDate")).sendKeys("2019-04-10");
        driver.findElement(By.id("subscriptionStartDate")).sendKeys(Keys.ENTER);
        driver.findElement(By.id("isin")).sendKeys(uIsin[0]);
        driver.findElement(By.id("shareClassCode")).sendKeys("share class");
        openDropdownAndSelectOption("shareClassCurrency", 1);
        openDropdownAndSelectOption("shareClassInvestmentStatus", 1);
        openDropdownAndSelectOption("status", 1);
        openDropdownAndSelectOption("valuationFrequency", 3);
        driver.findElement(By.id("hasCoupon")).click();
        openDropdownAndSelectOption("valuationFrequency", 3);
        scrollElementIntoViewById("cancelFundShareBottom");
        wait.until(visibilityOfElementLocated(By.id("cancelFundShareBottom")));
        wait.until(elementToBeClickable(By.id("cancelFundShareBottom")));
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

        WebElement subscriptionCutOffTime = driver.findElement(By.id("subscriptionCutOffTime"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].value = '12:12';", subscriptionCutOffTime);
        subscriptionCutOffTime.sendKeys(Keys.ARROW_UP);


        openDropdownAndSelectOption("subscriptionCutOffTimeZone", 1);
        openDropdownAndSelectOption("navPeriodForSubscription", 1);

        WebElement redemptionCutOffTime = driver.findElement(By.id("redemptionCutOffTime"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].value = '13:13';", redemptionCutOffTime);
        redemptionCutOffTime.sendKeys(Keys.ARROW_DOWN);

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

        try {
            scrollElementIntoViewById("saveFundShareBottom");
            wait.until(visibilityOfElementLocated(By.id("saveFundShareBottom")));
            wait.until(elementToBeClickable(driver.findElement(By.id("saveFundShareBottom"))));
            driver.findElement(By.id("saveFundShareBottom")).click();
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));
        String popupSubheading = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(popupSubheading.equals("Info!"));

        WebDriverWait waits = new WebDriverWait(driver, 30);
        waits.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[1]")));

        String shareCountXpathPost = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPost = Integer.parseInt(shareCountXpathPost.replaceAll("[\\D]", ""));

        assertTrue(shareCountPost == shareCountPre + 1);

        String shareNameID = driver.findElement(By.id("product-dashboard-fundShareID-" + shareCountPre + "-shareName")).getAttribute("id");
        int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));

        getShareTableRow(shareNameNo, uFundDetails[0], uIsin[0], unFundDetails[0], "EUR Euro", "Management Company", "", "share class", "Open" );
    }

}
