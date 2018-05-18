package com.setl.openCSDClarityTests.UI.MyProduct.Funds;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewFundShareTitle;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationCalendar;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationCharacteristics;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationKeyFacts;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationFees;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationProfile;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationSubmit;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSD4FundFlowAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(90000);
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
    public void shouldTestEntireFundFlow() throws InterruptedException, SQLException {

        //Login and navigate to Product Module
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        //Create umbrella fund for later use
        selectAddUmbrellaFund();
        String [] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], "16616758475934857531");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        //Store title number count for Funds
        String fundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCount = Integer.parseInt(fundCountXpath.replaceAll("[\\D]", ""));

        //Navigate to fund creation and create a fund with umbFund
        String [] uFundDetails = generateRandomFundsDetails();
        fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetailsStep2(uFundDetails[0]);

        //Assert fund table displays the information for the fund created previously, including umbFund
        getFundTableRow(fundCount, uFundDetails[0], "16616758475934857531", "EUR Euro", "Management Company", "Afghanistan","Contractual Fund", umbFundDetails[0]);

        //Store the number of shares created.
        String shareCountXpathPre = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPre = Integer.parseInt(shareCountXpathPre.replaceAll("[\\D]", ""));

        //Navigate to create a new share.
        waitForNewShareButton();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath("//*[@id='selectFund']/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(uFundDetails[0]);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());
        }

        WebDriverWait waiting = new WebDriverWait(driver, timeoutInSeconds);
        waiting.until(visibilityOfElementLocated(By.id("buttonSelectFund")));
        waiting.until(elementToBeClickable(By.id("buttonSelectFund")));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("tabFundShareButton")).isDisplayed());
        }catch (Exception e){
            fail("not present");
        }

        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        shareCreationKeyFacts(uShareDetails[0],uIsin[0]);
        shareCreationCharacteristics();
        shareCreationCalendar();
        shareCreationFees();
        shareCreationProfile();
        shareCreationSubmit();

        String shareCountXpathPost = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPost = Integer.parseInt(shareCountXpathPost.replaceAll("[\\D]", ""));
        assertTrue(shareCountPost == shareCountPre + 1);
        String shareNameID = driver.findElement(By.id("product-dashboard-fundShareID-" + shareCountPre + "-shareName")).getAttribute("id");
        int shareNameNo = Integer.parseInt(shareNameID.replaceAll("[\\D]", ""));

        getShareTableRow(shareNameNo, uShareDetails[0], uIsin[0], uFundDetails[0], "EUR Euro", "Management Company", "", "share class", "Open" );
    }

}
