package com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds;

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
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
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
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(umbFundDetails[0]);

        getUmbrellaTableRow(0, umbFundDetails[0], "16616758475934857531", "Management Company", "Jordan");

        String [] uFundDetails = generateRandomFundsDetails();
        fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetailsStep2(uFundDetails[0], "16615748475934658531");
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);

        getFundTableRow(0, uFundDetails[0], "16615748475934658531", "EUR", "Management Company", "Afghanistan","Contractual Fund", umbFundDetails[0]);
        waitForNewShareButton();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.xpath("//*[@id='selectFund']/div")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")));
        wait.until(elementToBeClickable(driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input"))));
        driver.findElement(By.xpath("//*[@id=\"selectFund\"]/div/div[3]/div/input")).sendKeys(uFundDetails[0]);
        try {
            driver.findElement(By.cssSelector("div > ul > li:nth-child(1) > div > a")).click();
        } catch (Exception e) {
            fail("dropdown not selected. " + e.getMessage());}

        WebDriverWait waiting = new WebDriverWait(driver, timeoutInSeconds);
        waiting.until(visibilityOfElementLocated(By.id("buttonSelectFund")));
        waiting.until(elementToBeClickable(By.id("buttonSelectFund")));
        WebElement selectFundBtn = driver.findElement(By.id("buttonSelectFund"));
        selectFundBtn.click();
        try {
            assertTrue(driver.findElement(By.id("tabFundShareButton")).isDisplayed());
        }catch (Exception e){
            fail("not present");}

        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        shareCreationKeyFacts(uShareDetails[0],uIsin[0]);
        shareCreationCharacteristics();
        shareCreationCalendar();
        shareCreationFees();
        shareCreationProfile();
        shareCreationSubmit();

        searchSharesTable(uShareDetails[0]);

        getShareTableRow(0, uShareDetails[0], uIsin[0], uFundDetails[0], "EUR", "Management Company", "", "share class", "Open" );
    }

}
