package com.setl.openCSDClarityTests.UI.Iznes1MyProduct.NetAssetValue;
import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static SETLAPIHelpers.DatabaseHelper.setDBTwoFAOff;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByClassName;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDNAVAcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(130000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);


    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
        setDBToProdOff();
        setDBTwoFAOff();
    }

    @After
    public void tearDown() throws Exception {
        setDBToProdOn();
    }

    @Test
    public void TG0204_shouldDisplayCorrectFieldsOnNAVPage() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToNAVPage();
        validateNAVPageLayout();
        validateNAVDataGridHeadings(NAVHeadings);
    }

    @Test
    public void TG0204_shouldCreateNav() throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        int rowNo = 0;

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], generateRandomLEI());

        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);

        navigateToNAVPageFromFunds();

        wait.until(refreshed(visibilityOfElementLocated(By.id("Btn-AddNewNAV-" + rowNo))));
        wait.until(refreshed(elementToBeClickable(By.id("Btn-AddNewNAV-" + rowNo))));
        driver.findElement(By.id("Btn-AddNewNAV-" + rowNo)).click();
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3/span"))));
        String NAVpopupTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3/span")).getText();
        assertTrue(NAVpopupTitle.equals("Add New NAV"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).clear();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).sendKeys("12");
        searchAndSelectTopDropdown("Status-nav-btn", "Validated");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[3]/button[2]")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.className("jaspero__dialog-title"))));
        String successSubText = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[3]/table/tbody/tr/td")).getText();
        assertTrue(successSubText.equals("Successfully Updated NAV"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")));
        try {
            String TableNav = driver.findElement(By.id("NAV-Value-" + rowNo)).getText();
            assertTrue(TableNav.equals("12.00"));
        } catch (Error e) {
            fail(e.getMessage());
        }
    }

    @Test
    public void TG0205_shouldReceiveShareDataInNAVTable() throws InterruptedException, SQLException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("yes", "none");
        fillOutFundDetailsStep2(uFundDetails[0], generateRandomLEI());

        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);

        navigateToNAVPageFromFunds();
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-Share-Name-0"))));
        driver.findElement(By.id("Search-field")).sendKeys(uShareDetails[0]);
        wait.until(invisibilityOfElementLocated(By.id("NAV-Share-Name-1")));
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-Share-Name-0"))));
        String shareName = driver.findElement(By.id("NAV-Share-Name-0")).getText();
        assertTrue(shareName.equals(uShareDetails[0]));
        String ISIN = driver.findElement(By.id("NAV-ISIN-0")).getText();
        assertTrue(ISIN.equals(uIsin[0]));
        assertTrue(driver.findElement(By.id("Btn-AddNewNAV-0")).isDisplayed());
        String NavDate = driver.findElement(By.id("NAV-NAV-Date-0")).getText();
        assertTrue(NavDate.equals(getTodayDate()));
    }

    @Test
    public void TG0206_AccessNAVSubModuleCheckDetails() throws InterruptedException, SQLException {
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], generateRandomLEI());

        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        navigateToNAVPageFromFunds();
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-Share-Name-0"))));
        driver.findElement(By.id("Search-field")).sendKeys(uShareDetails[0]);
        wait.until(invisibilityOfElementLocated(By.id("NAV-Share-Name-1")));
        String ShareName = driver.findElement(By.id("NAV-Share-Name-0")).getText();
        System.out.println(uShareDetails[0]);
        System.out.println(ShareName);
        assertTrue(ShareName.equals(uShareDetails[0]));
        driver.findElement(By.id("NAV-Share-Name-0")).click();
        wait.until(refreshed(visibilityOfElementLocated(By.id("shareName"))));
        String shareName = driver.findElement(By.id("shareName")).getAttribute("value");
        assertTrue(shareName.equals(uShareDetails[0]));
        String navISIN = driver.findElement(By.id("isin")).getAttribute("value");
        assertTrue(navISIN.equals(uIsin[0]));
        String amCompany = driver.findElement(By.id("amCompany")).getAttribute("value");
        assertTrue(amCompany.equals("Management Company"));
        String Date = driver.findElement(By.id("currentDate")).getAttribute("value");
        assertTrue(Date.equals(getTodayDate()));
        String NavCcy = driver.findElement(By.id("navCurrency")).getAttribute("value");
        assertTrue(NavCcy.equals("EUR (€)"));
        String NAVStatus = driver.findElement(By.id("nav")).getAttribute("value");
        assertTrue(NAVStatus.equals("Pending"));
        assertTrue(driver.findElement(By.id("numberofshare")).isDisplayed());
        assertTrue(driver.findElement(By.id("aum")).isDisplayed());
        assertTrue(driver.findElement(By.id("navDateFrom")).isDisplayed());
        assertTrue(driver.findElement(By.id("navDateTo")).isDisplayed());
    }

    @Test
    public void TG0207_CheckNavDetailsForNoneValueDataAndSelectDateField() throws InterruptedException, SQLException {
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], generateRandomLEI());

        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        navigateToNAVPageFromFunds();
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-Share-Name-0"))));
        driver.findElement(By.id("NAV-Share-Name-0")).click();
        driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[2]/span/span")).click();
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[1]/div/a/div")).isDisplayed());
        String L30D = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[1]/div/a/div")).getText();
        assertTrue(L30D.equals("Last 30 days"));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[2]/div/a/div")).isDisplayed());
        String L3m = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[2]/div/a/div")).getText();
        assertTrue(L3m.equals("Last 3 months"));
        scrollElementIntoViewByXpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[3]/div/a/div");
        wait.until(refreshed(visibilityOfElementLocated(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[3]/div/a/div"))));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[3]/div/a/div")).isDisplayed());
        String L6m = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[3]/div/a/div")).getText();
        assertTrue(L6m.equals("Last 6 months"));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[4]/div/a/div")).isDisplayed());
        String L9m = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[4]/div/a/div")).getText();
        assertTrue(L9m.equals("Last 9 months"));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[5]/div/a/div")).isDisplayed());
        String L12m = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[5]/div/a/div")).getText();
        assertTrue(L12m.equals("Last 12 months"));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[6]/div/a/div")).isDisplayed());
        String YTD = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[6]/div/a/div")).getText();
        assertTrue(YTD.equals("Year to date"));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[7]/div/a/div")).isDisplayed());
        String STB = driver.findElement(By.xpath("//*[@id=\"searchDatePeriod\"]/div/div[3]/ul/li[7]/div/a/div")).getText();
        assertTrue(STB.equals("Since the beginning"));
        driver.findElement(By.id("navDateTo")).click();
        driver.findElement(By.id("navDateTo")).clear();
        driver.findElement(By.id("navDateTo")).sendKeys("2018-05-24");
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"nav-history-row0-btn-edit\"]/span")));
    }

    @Test
    public void TG3127_ShouldChangeNAVStatusToCancelledNoOrders() throws InterruptedException, SQLException, IOException {
        String AMUsername = "am";
        String AMPassword = "alex01";
        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String fundLei = generateRandomLEI();
        int latestNav = 14;
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("yes", "none");
        fillOutFundDetailsStep2(uFundDetails[0], fundLei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        searchSharesTable(uShareDetails[0]);
        setSharesNAVandValidate(uShareDetails[0], latestNav);

        wait.until(visibilityOfElementLocated(By.id("Btn-CancelNAV-0")));
        driver.findElement(By.id("Btn-CancelNAV-0")).click();
        Thread.sleep(1000);
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        String jasperoTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(jasperoTitle.equals("Cancel NAV"));
        String jasperoContent = driver.findElement(By.className("jaspero__dialog-content")).getText();
        assertTrue(jasperoContent.contains("Are you sure you wish to cancel the NAV for"));
        assertTrue(jasperoContent.contains(uShareDetails[0]));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        Thread.sleep(1000);
        String jasperoTitle2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(jasperoTitle2.equals("Success!"));
        String jasperoContent2 = driver.findElement(By.className("jaspero__dialog-content")).getText();
        assertTrue(jasperoContent2.contains("NAV successfully cancelled."));
    }

    @Test
    public void TG3127_ShouldChangeNAVStatusToCancelledNoCorporateAction()throws InterruptedException, SQLException {
        //Tested in TG3127_ShouldChangeNAVStatusToCancelledNoOrders
    }

    @Test
    public void TG3127_ShouldChangeNAVStatusToCancelledDatabase() throws InterruptedException, SQLException, IOException {
        String AMUsername = "am"; String AMPassword = "alex01";
        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String fundLei = generateRandomLEI();
        int latestNav = 14;
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("yes", "none");
        fillOutFundDetailsStep2(uFundDetails[0], fundLei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        searchSharesTable(uShareDetails[0]);
        setSharesNAVandValidate(uShareDetails[0], latestNav);

        //DB Check nav is validated

        wait.until(visibilityOfElementLocated(By.id("Btn-CancelNAV-0")));
        driver.findElement(By.id("Btn-CancelNAV-0")).click();
        Thread.sleep(1000);
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        //DB Check nav is cancelled

    }

    @Test
    public void TG3127_ShouldUpdateToPreviousNAVWhenCurrentNAVCancelled() throws InterruptedException, SQLException, IOException {
        String AMUsername = "am"; String AMPassword = "alex01";
        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String fundLei = generateRandomLEI();
        int latestNav = 14;
        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        fillOutFundDetailsStep1("yes", "none");
        fillOutFundDetailsStep2(uFundDetails[0], fundLei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);

        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        setSharesNAVandValidate(uShareDetails[0], latestNav);
        Thread.sleep(1000);
        String NAVPre = driver.findElement(By.id("NAV-Val-Value-0")).getText();
        assertTrue(NAVPre.equals(latestNav + ".00"));
        wait.until(visibilityOfElementLocated(By.id("Btn-CancelNAV-0")));
        driver.findElement(By.id("Btn-CancelNAV-0")).click();
        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
        Thread.sleep(1000);
        String NAVPost = driver.findElement(By.id("NAV-Val-Value-0")).getText();
        assertTrue(NAVPost.equals("N/A"));
    }

    @Test
    @Ignore
    public void TG3127_ShouldNotifyEachInvestorWithAuthorisationOnTheShare()throws InterruptedException, SQLException {
        System.out.println("cannot automated reliably enough yet");
    }

    @Test
    public void TG3129_ShouldNotBeAbleToModifyNAVIfNoOrdersIsSettled() throws InterruptedException, SQLException, IOException {
        String AMUsername = "am"; String AMPassword = "alex01";

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String fundLei = generateRandomLEI();
        int latestNav = 14;

        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess(AMUsername, AMPassword);
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("yes", "none");
        fillOutFundDetailsStep2(uFundDetails[0], fundLei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);

        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        searchSharesTable(uShareDetails[0]);

        setSharesNAVandValidate(uShareDetails[0], latestNav);

        Thread.sleep(1000);

        wait.until(visibilityOfElementLocated(By.id("Btn-ModifyNAV-0")));
        driver.findElement(By.id("Btn-ModifyNAV-0")).click();
        wait.until(visibilityOfElementLocated(By.id("edit-nav-title")));

        Thread.sleep(5000);
        driver.findElement(By.id("Set-nav-field")).clear();
        driver.findElement(By.id("Set-nav-field")).sendKeys("23.00");
        driver.findElement(By.id("Validate-nav-btn")).click();

        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
        String jasperoTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(jasperoTitle.equals("Success!"));
        String jasperoContent = driver.findElement(By.className("jaspero__dialog-content")).getText();
        assertTrue(jasperoContent.contains("Successfully Updated NAV"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();

        String NAVPre = driver.findElement(By.id("NAV-Val-Value-0")).getText();
        assertTrue(NAVPre.equals("23.00"));

    }

    public static void navModifyOrCancel(String shares, String modifyOrCancel, int modNav) throws InterruptedException {

        final WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        driver.findElement(By.id("Search-field")).sendKeys(shares);
        Thread.sleep(1000);

        if (modifyOrCancel.equals("modify")) {

            wait.until(visibilityOfElementLocated(By.id("Btn-ModifyNAV-0")));
            driver.findElement(By.id("Btn-ModifyNAV-0")).click();
            wait.until(visibilityOfElementLocated(By.id("edit-nav-title")));
            Thread.sleep(1000);
            driver.findElement(By.id("Set-nav-field")).clear();
            driver.findElement(By.id("Set-nav-field")).sendKeys(modNav + ".00");
            driver.findElement(By.id("Validate-nav-btn")).click();
            wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
            String jasperoTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(jasperoTitle.equals("Success!"));
            String jasperoContent = driver.findElement(By.className("jaspero__dialog-content")).getText();
            assertTrue(jasperoContent.contains("Successfully Updated NAV"));
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
            String NAVPre = driver.findElement(By.id("NAV-Val-Value-0")).getText();
            assertTrue(NAVPre.equals(modNav + ".00"));

        }if (modifyOrCancel.equals("cancel")){

            wait.until(visibilityOfElementLocated(By.id("Btn-CancelNAV-0")));
            driver.findElement(By.id("Btn-CancelNAV-0")).click();
            Thread.sleep(1000);
            wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
            String jasperoTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(jasperoTitle.equals("Cancel NAV"));
            String jasperoContent = driver.findElement(By.className("jaspero__dialog-content")).getText();
            assertTrue(jasperoContent.contains("Are you sure you wish to cancel the NAV for"));
            assertTrue(jasperoContent.contains(shares));
            driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();
            Thread.sleep(1000);
            String jasperoTitle2 = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(jasperoTitle2.equals("Success!"));
            String jasperoContent2 = driver.findElement(By.className("jaspero__dialog-content")).getText();
            assertTrue(jasperoContent2.contains("NAV successfully cancelled."));
        }
    }

    @Test
    //TODO Sprint 14
    public void TG3129_ShouldAddNewValidatedNAVWhenExistingNAVisModified()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3129_ShouldNotifyInvestorWithAccessToTheNAVModule()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3129_ShouldNotNotifyInvestorWithoutAccessToTheNAVModule()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3125_ShouldEraseNAVFromTableDatabseWhenDeleted()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }

    @Test
    //TODO Sprint 14
    public void TG3125_ShouldEraseNAVFromTableFrontendWhenDeleted()throws InterruptedException, SQLException {
//            loginAndVerifySuccess("am", "alex01");
//            navigateToDropdown("KYC");
//            navigateToDropdown("Umbrella, Funds, Shares");
//            selectCreateFund("fundName", "ISIN");
//            selectCreateShare("shareName", "IBAN");
//            navigateToNAVPage();
//            selectSearchNAV("shareName, ISIN");
//            selectShare("shareName");
//            assertNAVDetails("shareName", "ISIN", "assetManagementCompanyName");
//            selectAddNewNAV(100, "");
//            selectDeleteNAV(50, "");
//            validateNAVCancelledDB(100, "");
//            navigateToNAVPage();
//            selectSearchNAV("shareName");
//            assertRowReturn(0);
    }

    @Test
    //TODO Sprint 14
    public void TG3125_ShouldNotifyEachInvestorWithAuthorisationOnTheShare()throws InterruptedException, SQLException {
//            loginAndVerifySuccess("am", "alex01");
//            navigateToDropdown("KYC");
//            navigateToDropdown("Umbrella, Funds, Shares");
//            selectCreateFund("fundName", "ISIN");
//            selectCreateShare("shareName", "IBAN");
//            navigateToNAVPage();
//            selectSearchNAV("shareName, ISIN");
//            selectShare("shareName");
//            assertNAVDetails("shareName", "ISIN", "assetManagementCompanyName");
//            selectAddNewNAV(100, "");
//            navigateToDropdown("My-Clients");
//            navigateToDropdown("Client-Referential");
//            selectInviteInvestor();
//            investorInviteOption("email", "firstName", "lastName", "ref", "type");
//            logout();
//            investorAccountCreation("email", "PWD");
//            companyDetails("companyName", "phoneNumber");
//            completeKYC();
//            logout();
//            loginAndVerifySuccess("am", "alex01");
//            navigateToDropdown("My-Clients");
//            navigateToDropdown("Onboarding-Management");
//            selectInvestor("companyName");
//            authoriseShareAccess("shareName");
//            navigateToNAVPage();
//            selectSearchNAV("shareName");
//            selectShare("share");
//            selectDeleteNAV(100, "yes");
//            logout();
//            loginAndVerifySuccess("investorEmail", "PWD");
//            selectMessages();
//            selectTopMessage("subject");
//            assertContentOfMessage("AM has deleted NAV for share 'shareName'");
//            selectDeleteNAV(0, "");
    }

    @Test
    //TODO Sprint 14
    public void TG3125_ShouldNotNotifyInvestorWithoutAuthorisationOnTheShare()throws InterruptedException, SQLException {
        /*
        This is a negative test not if we want to implement it as its a long test, its a duplicate of the above however create 2x shares and assign share B to investor not share A
        Update share A with NAV and check investor for the message. Not sure yet if it will be a message or a popup or whatever.
         */
    }

}
