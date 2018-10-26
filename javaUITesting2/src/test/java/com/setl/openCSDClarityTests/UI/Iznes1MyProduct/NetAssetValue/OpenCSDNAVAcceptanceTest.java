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
    public void shouldDisplayCorrectFieldsOnNAVPageTG204() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToNAVPage();
        validateNAVPageLayout();
        validateNAVDataGridHeadings(NAVHeadings);
    }


    @Test
    public void shouldCreateNav() throws InterruptedException, SQLException {
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
    public void shouldReceiveShareDataInNAVTableTG205() throws InterruptedException, SQLException, IOException
    {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], generateRandomLEI());
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");

        fillOutFundDetailsStep1("yes", umbFundDetails[0]);
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
    public void ShouldCreateFundAndSearchForFundByFundNameTG206() throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

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
        driver.findElement(By.id("Search-field")).sendKeys("WrongShare");
        wait.until(invisibilityOfElementLocated(By.id("NAV-Share-Name-0")));
        driver.findElement(By.id("Search-field")).clear();
        driver.findElement(By.id("Search-field")).sendKeys(uShareDetails[0]);
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-Share-Name-0"))));
        assertTrue(driver.findElement(By.id("NAV-Share-Name-0")).isDisplayed());
        String navShareName = driver.findElement(By.id("NAV-Share-Name-0")).getText();
        assertTrue(navShareName.equals(uShareDetails[0]));
    }

    @Test
    public void ShouldCreateFundAndSearchForFundByISINTG206() throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], generateRandomLEI());

        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);

        navigateToNAVPageFromFunds();
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-ISIN-0"))));
        driver.findElement(By.id("Search-field")).sendKeys("WrongISIN");
        wait.until(invisibilityOfElementLocated(By.id("NAV-ISIN-0")));
        driver.findElement(By.id("Search-field")).clear();
        driver.findElement(By.id("Search-field")).sendKeys(uIsin[0]);
        wait.until(refreshed(visibilityOfElementLocated(By.id("NAV-ISIN-0"))));
        assertTrue(driver.findElement(By.id("NAV-ISIN-0")).isDisplayed());
        String navShareName = driver.findElement(By.id("NAV-ISIN-0")).getText();
        assertTrue(navShareName.equals(uIsin[0]));
    }

    @Test
    public void AccessNAVSubModuleCheckDetailsTG206TG212() throws InterruptedException, SQLException {
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
    public void CheckNavDetailsForNoneValueDataAndSelectDateFieldTG207() throws InterruptedException, SQLException {
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
    //TODO Sprint 14
    public void TG3127_ShouldChangeNAVStatusToCancelledNoOrders()throws InterruptedException, SQLException {
       try {
           loginAndVerifySuccess("am", "alex01");
           navigateToDropdown("");
           navigateToDropdown("");
           selectCreateFund("", "");
           selectCreateShare("", "");
           navigateToNAVPage();
           selectSearchNAV("");
           selectShare("");
           assertNAVDetails("", "");
           selectAddNewNAV(0, "");
           selectDeleteNAV(0,"Yes");
       }catch (Exception e) {
           fail("Not yet implemented");
       }
    }
    private void assertNAVDetails(String shareName, String isin) {
    }

    private void selectAddNewNAV(int amount, String status) {
    }

    private void selectShare(String shareName) {
    }

    private void selectSearchNAV(String shareName) {
    }

    private void selectDeleteNAV(int i, String answer) {
        if (answer.equals("Yes"))
        {

        }
        if (answer.equals("No"))
        {

        }
    }

    private void selectCreateShare(String shareName, String iban) {
    }

    private void selectCreateFund(String fundName, String isin) {
    }
    @Test
    //TODO Sprint 14
    public void TG3127_ShouldChangeNAVStatusToCancelledNoCorporateAction()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
        /*
        There is no corporate action module yet
         */
    }
    @Test
    //TODO Sprint 14
    public void TG3127_ShouldChangeNAVStatusToCancelledDatabase()throws InterruptedException, SQLException {
        try {
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("");
            navigateToDropdown("");
            selectCreateFund("", "");
            selectCreateShare("", "");
            navigateToNAVPage();
            selectSearchNAV("");
            selectShare("");
            assertNAVDetails("", "");
            selectAddNewNAV(100, "");
            selectDeleteNAV(0,"");
            validateNAVCancelledDB(100, "");
        }catch (Exception e) {
            fail("Not yet implemented");
        }
    }
    private void validateNAVCancelledDB(int amount, String status) {
        /*
        Make the status ambiguous, pass through the status from the test itself so it can be reused
         */
    }
    @Test
    //TODO Sprint 14
    public void TG3127_ShouldUpdateToPreviousNAVWhenCurrentNAVCancelled()throws InterruptedException, SQLException {
        try {
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("");
            navigateToDropdown("");
            selectCreateFund("", "");
            selectCreateShare("", "");
            navigateToNAVPage();
            selectSearchNAV("");
            selectShare("");
            assertNAVDetails("", "");
            selectAddNewNAV(50, "");
            selectAddNewNAV(100, "");
            selectDeleteNAV(0, "");
            validateNAVCancelledDB(100, "");
            assertNAVPageAmount(50, "");
        }catch (Exception e) {
            fail("Not yet implemented");
        }
    }
    private void assertNAVPageAmount(int amount, String shareName) {

    }
    @Test
    //TODO Sprint 14
    public void TG3127_ShouldNotifyEachInvestorWithAuthorisationOnTheShare()throws InterruptedException, SQLException {
        System.out.println("Not Yet Implemented");
    }
    @Test
    //TODO Sprint 14
    public void TG3129_ShouldNotBeAbleToModifyNAVIfNoOrdersIsSettled()throws InterruptedException, SQLException {
        try {
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("KYP");
            navigateToDropdown("Product");
            selectCreateFund("name", "isin");
            selectCreateShare("name", "iban");
            navigateToNAVPage();
            selectSearchNAV("shareName");
            selectShare("shareName");
            selectAddNewNAV(100, "Verified");
            navigateToDropdown("My-Clients");
            navigateToDropdown("Client-Referential");
            selectInviteInvestor();
            investorInviteOption("email", "firstName", "lastName", "ref", "Type");
            logout();
            investorAccountCreation("investorEmail", "PWD");
            companyDetails("companyName", "phoneNumber");
            completeKYC();
            logout();
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("My-Client");
            navigateToDropdown("Onboarding-Management");
            selectInvestor("companyName");
            acceptKYCRequest("Accepted");
            authoriseShareAccess("shareName");
            logout();
            loginAndVerifySuccess("investorEmail", "PWD");
            assertPage("Sub-Portfolio");
            selectAddNewSubPortfolio("ibanName", "ibanNumber");
            navigateToDropdown("OrderBook");
            navigateToDropdown("Place-Order");
            selectSubscribe("shareName");
            placeOrderDetails("date", "subportfolio", 100, "tick", "OrderID");
            logout();
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("OrderBook");
            searchOrderBook("shareName", "OrderID");
            waitUntilOrderStatus("AwaitingSettlement");
            selectSettle("Settle");
            navigateToNAVPage();
            selectSearchNAV("shareName");
            selectShare("shareName");
            selectNAVandAssertStatus("delete/cancel", "Status");
            validateNAVCancelledDB(100, "Validated");
        }catch (Exception e){
            fail("Not yet implemented");
        }
    }

    private void selectNAVandAssertStatus(String action, String status) {

    }

    private void selectSettle(String action) {

    }

    private void waitUntilOrderStatus(String orderStatus) {

    }

    private void searchOrderBook(String shareName, String orderID) {

    }

    private void placeOrderDetails(String date, String subportfolio, int amount, String tick, String orderID) {

    }

    private void selectSubscribe(String shareName) {

    }

    private void selectAddNewSubPortfolio(String ibanName, String ibanNumber) {

    }

    private void assertPage(String pageName) {
    }

    private void authoriseShareAccess(String shareName) {

    }

    private void acceptKYCRequest(String accepted) {

    }

    private void selectInvestor(String companyName) {
    }

    private void completeKYC() {
    }

    private void companyDetails(String companyName, String phoneNumber) {
    }

    private void investorAccountCreation(String investorEmail, String pwd) {
    }

    private void selectInviteInvestor() {
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
        try {
            loginAndVerifySuccess("am", "alex01");
            navigateToDropdown("");
            navigateToDropdown("");
            selectCreateFund("", "");
            selectCreateShare("", "");
            navigateToNAVPage();
            selectSearchNAV("");
            selectShare("");
            assertNAVDetails("", "");
            selectAddNewNAV(100, "");
            selectDeleteNAV(0,"");
            validateNAVCancelledDB(100, "");
            navigateToNAVPage();
            selectSearchNAV("shareName");
            assertRowReturn(0);
        }catch (Exception e) {
            fail("no yet implemented");
        }
    }
    private void assertRowReturn(int rowCount) {

    }
    @Test
    //TODO Sprint 14
    public void TG3125_ShouldNotifyEachInvestorWithAuthorisationOnTheShare()throws InterruptedException, SQLException {
       try {
           loginAndVerifySuccess("am", "alex01");
           navigateToDropdown("");
           navigateToDropdown("");
           selectCreateFund("", "");
           selectCreateShare("", "");
           navigateToNAVPage();
           selectSearchNAV("");
           selectShare("");
           assertNAVDetails("", "");
           selectAddNewNAV(100, "");
           navigateToDropdown("My-Clients");
           navigateToDropdown("Client-Referential");
           selectInviteInvestor();
           investorInviteOption("email", "firstName", "lastName", "ref", "type");
           logout();
           investorAccountCreation("email", "PWD");
           companyDetails("companyName", "phoneNumber");
           completeKYC();
           logout();
           loginAndVerifySuccess("am", "alex01");
           navigateToDropdown("My-Clients");
           navigateToDropdown("Onboarding-Management");
           selectInvestor("companyName");
           authoriseShareAccess("shareName");
           navigateToNAVPage();
           selectSearchNAV("shareName");
           selectShare("share");
           selectDeleteNAV(100, "yes");
           logout();
           loginAndVerifySuccess("investorEmail", "PWD");
           selectMessages();
           selectTopMessage("subject");
           assertContentOfMessage("AM has deleted NAV for share 'shareName'");
           selectDeleteNAV(0, "");
       }catch (Exception e) {
           fail("not yet implemented");
       }
    }
    private void assertContentOfMessage(String messageBody) {

    }

    private void selectTopMessage(String subject) {

    }

    private void selectMessages() {

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
