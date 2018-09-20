package com.setl.openCSDClarityTests.UI.Iznes1SanityTests;

import com.setl.UI.common.SETLUtils.Repeat;
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
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomISIN;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessWelcomeToIZNES;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessMakeNewRequest;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep1;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep2;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep4;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep5;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessStep6;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCProcessRequestListValidation;
import static com.setl.UI.common.SETLUIHelpers.KYCDetailsHelper.KYCAcceptMostRecentRequest;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByCss;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewByXpath;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageContains;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDEntireFlowAcceptanceTest {

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String username = "root";
    static String password = "nahafusi61hucupoju78";

    static String testusername = "TestUserNullInfo";
    static String testpassword = "Testpass123";

    JavascriptExecutor jse = (JavascriptExecutor) driver;


    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout(250000);
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
    public void shouldTestEntireFundFlow() throws InterruptedException, SQLException, IOException {

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] umbFundDetails = generateRandomUmbrellaFundsDetails();
        String[] uIsin = generateRandomISIN();
        String umbLei = generateRandomLEI();
        String fundLei = generateRandomLEI();
        String shareCurrency = "EUR";
        int latestNav = 14;

        String No = "6";
        String userNo = "00" + No;
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String firstName = "Jordan";
        String lastName = "Miller";
        String phoneNo = "07956701992";

        String[] uSubNameDetails = generateRandomSubPortfolioName();
        String[] uSubIBANDetails = generateRandomSubPortfolioIBAN();
        String[] uAmount = generateRandomAmount();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], umbLei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        searchUmbrellaTable(umbFundDetails[0]);
        getUmbrellaTableRow(0, umbFundDetails[0], umbLei, "Management Company", "Jordan");
        fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetailsStep2(uFundDetails[0], fundLei);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        getFundTableRow(0, uFundDetails[0], fundLei, "EUR", "Management Company", "Afghanistan", "Contractual Fund", umbFundDetails[0]);
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        searchSharesTable(uShareDetails[0]);
        getShareTableRow(0, uShareDetails[0], uIsin[0], uFundDetails[0], shareCurrency, "Management Company", "", "share class", "Open");

        setSharesNAVandValidate(uShareDetails[0], latestNav);

        loginAndVerifySuccessKYC("testops" + userNo + "@setl.io", "asdasd", "additionnal");
        KYCProcessWelcomeToIZNES(userNo, companyName, phoneNo);
        KYCProcessMakeNewRequest();
        KYCProcessStep1(managementCompEntered, "No", "False", "");
        KYCProcessStep2();
        KYCProcessStep3GeneralInfoComplete();
        KYCProcessStep3CompanyInfoComplete();
        KYCProcessStep3BankingInfoComplete();
        KYCProcessStep4();
        KYCProcessStep5();
        KYCProcessStep6(firstName + " " + lastName, "SETL Developments LTD", "Ipswich", "Head");
        KYCProcessRequestListValidation("Yes","Success!", managementCompEntered, "Waiting approval", "No", "", "");
        KYCAcceptMostRecentRequest(companyName, No, firstName, lastName, userNo, phoneNo);

        validateClientReferentialAndGrantFundAccess(companyName, No, uIsin[0]);

        loginAndVerifySuccess("testops" + userNo + "@setl.io", "asdasd");
        createSubPortfolio(uSubNameDetails[0], uSubIBANDetails[0]);

        navigateToDropdown("menu-order-module");
        navigateToPageByID("menu-list-of-fund");
        verifyCorrectPage("Place an Order");
        Thread.sleep(1000);

        String orderGridISIN = driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(1) > button")).getText();
        assertTrue(orderGridISIN.equals(uIsin[0]));

        String orderGridShareName = driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(2) > button")).getText();
        assertTrue(orderGridShareName.equals(uShareDetails[0]));

        String orderGridAssetManager = driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(4)")).getText();
        assertTrue(orderGridAssetManager.equals(managementCompEntered));

        String orderGridShareCurrency = driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(7)")).getText();
        assertTrue(orderGridShareCurrency.equals(shareCurrency));

        String orderGridNAV = driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(8)")).getText();
        assertTrue(orderGridNAV.equals(latestNav + ".00"));

        driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell.actions.datagrid-cell.ng-star-inserted > div > button.btn.btn-success.btn-sm")).click();

        Thread.sleep(1000);

        driver.findElement(By.xpath("//*[@id=\"subportfolio\"]/div")).click();
        //Thread.sleep(750);
        //driver.findElement(By.cssSelector("#subportfolio > div > div.option-wrapper.ui-select-choices.dropdown-menu.ng-star-inserted > div > input")).sendKeys(uSubNameDetails[0]);
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"subportfolio\"]/div/div[3]/ul/li/div/a")).click();

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String date1= dateFormat.format(date);

        DateFormat dateFormat1 = new SimpleDateFormat("HH");
        Date dates = new Date();
        String hours= dateFormat1.format(dates);

        DateFormat dateFormat2 = new SimpleDateFormat("mm");
        Date dates2 = new Date();
        String date3= dateFormat2.format(dates2);

        int timeHoursInt = Integer.parseInt(hours);
        int timeMinsInt = Integer.parseInt(date3);
        int timeMinsAfter = timeMinsInt + 2;
        String time = timeHoursInt + ":" + timeMinsAfter;

        String orderDate = date1 + " " + time + ";" + date1 + " " + time + ";" + date1 + " " + time + ";";

        System.out.println(orderDate);

        scrollElementIntoViewById("quantity");

        Thread.sleep(750);

        driver.findElement(By.id("cutoffdate")).sendKeys(orderDate);
        Thread.sleep(750);
        driver.findElement(By.id("valuationdate")).sendKeys(orderDate);
        Thread.sleep(750);
        driver.findElement(By.id("settlementdate")).sendKeys(orderDate);

        driver.findElement(By.id("quantity")).clear();
        driver.findElement(By.id("quantity")).sendKeys(uAmount[0]);

        scrollElementIntoViewByCss("app-invest-fund > form > div > div.row > div > div > button.btn.btn-primary.ng-star-inserted");

        Thread.sleep(750);

        driver.findElement(By.id("checkbox")).click();

        driver.findElement(By.cssSelector("app-invest-fund > form > div > div.row > div > div > button.btn.btn-primary.ng-star-inserted")).click();

        Thread.sleep(1000);

        String modalTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]/span")).getText();
        assertTrue(modalTitle.equals("Order Confirmation"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        Thread.sleep(1000);

    }

    @Test
    @Repeat
    public void shouldTestEntireFundFlow8() throws InterruptedException, SQLException, IOException {

        String[] uAmount = generateRandomAmount();

        loginAndVerifySuccess("testops" + "003" + "@setl.io", "asdasd");

        navigateToDropdown("menu-order-module");
        navigateToPageByID("menu-list-of-fund");
        verifyCorrectPage("Place an Order");
        Thread.sleep(1000);

        driver.findElement(By.cssSelector("div > div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell.actions.datagrid-cell.ng-star-inserted > div > button.btn.btn-success.btn-sm")).click();

        Thread.sleep(1000);

        driver.findElement(By.xpath("//*[@id=\"subportfolio\"]/div")).click();
        //Thread.sleep(750);
        //driver.findElement(By.cssSelector("#subportfolio > div > div.option-wrapper.ui-select-choices.dropdown-menu.ng-star-inserted > div > input")).sendKeys(uSubNameDetails[0]);
        Thread.sleep(750);
        driver.findElement(By.xpath("//*[@id=\"subportfolio\"]/div/div[3]/ul/li/div/a")).click();

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String date1= dateFormat.format(date);

        DateFormat dateFormat1 = new SimpleDateFormat("HH");
        Date dates = new Date();
        String hours= dateFormat1.format(dates);

        DateFormat dateFormat2 = new SimpleDateFormat("mm");
        Date dates2 = new Date();
        String date3= dateFormat2.format(dates2);

        int timeHoursInt = Integer.parseInt(hours);
        int timeMinsInt = Integer.parseInt(date3);
        int timeMinsAfter = timeMinsInt + 2;
        String time = "0" + timeHoursInt + ":" + timeMinsAfter;

        String orderDate = date1 + " " + time + ";" + date1 + " " + time + ";" + date1 + " " + time + ";";

        System.out.println(orderDate);

        scrollElementIntoViewById("quantity");

        Thread.sleep(750);

        driver.findElement(By.id("cutoffdate")).sendKeys(orderDate);
        driver.findElement(By.id("valuationdate")).sendKeys(orderDate);
        driver.findElement(By.id("settlementdate")).sendKeys(orderDate);

        driver.findElement(By.id("quantity")).clear();
        System.out.println(uAmount[0]);
        driver.findElement(By.id("quantity")).sendKeys(uAmount[0]);

        scrollElementIntoViewByCss("app-invest-fund > form > div > div.row > div > div > button.btn.btn-primary.ng-star-inserted");

        Thread.sleep(750);

        driver.findElement(By.id("checkbox")).click();

        driver.findElement(By.cssSelector("app-invest-fund > form > div > div.row > div > div > button.btn.btn-primary.ng-star-inserted")).click();

        Thread.sleep(1000);

        String modalTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]/span")).getText();
        assertTrue(modalTitle.equals("Order Confirmation"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        Thread.sleep(1000);
    }

    public static void createSubPortfolio(String subName, String subIBAN) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        navigateToPageByID("menu-sub-portfolio");
        verifyCorrectPageContains("Sub-portfolio");

        driver.findElement(By.id("btn-add-new-subportfolio")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div")));
        String modalTitleSubPortfolio = driver.findElement(By.id("override_header")).getText();
        Thread.sleep(750);
        assertTrue(modalTitleSubPortfolio.equals("Create A New Sub-portfolio"));
        String disabledCreateBtn = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertTrue(disabledCreateBtn.equals("true"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div/div[2]/form/div[1]/div/input")).sendKeys(subName);
        String disabledCreateBtn2 = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertTrue(disabledCreateBtn2.equals("true"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div/div[2]/form/div[2]/div/input")).sendKeys(subIBAN);
        driver.findElement(By.xpath("//*[@id=\"override_save\"]")).click();
        Thread.sleep(2500);

        String subPortfolioNameDataGrid = driver.findElement(By.cssSelector("clr-dg-row > div > clr-dg-cell:nth-child(1) > span")).getText();
        System.out.println(subPortfolioNameDataGrid);
        System.out.println(subName);
        assertTrue(subPortfolioNameDataGrid.equals(subName));
        String subPortfolioIBANDataGrid = driver.findElement(By.cssSelector("div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row > div > clr-dg-cell:nth-child(2) > span")).getText();
        System.out.println(subPortfolioIBANDataGrid);
        System.out.println(subIBAN);
        assertTrue(subPortfolioIBANDataGrid.equals(subIBAN));
    }

    @Test
    public void shouldTestEntireFundFlow3() throws InterruptedException, SQLException, IOException {

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess("testops" + "001" + "@setl.io", "asdasd");
        navigateToPageByID("menu-sub-portfolio");
        verifyCorrectPageContains("Sub-portfolio");

        driver.findElement(By.id("btn-add-new-subportfolio")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div")));
        String modalTitleSubPortfolio = driver.findElement(By.id("override_header")).getText();
        System.out.println(modalTitleSubPortfolio);
        assertTrue(modalTitleSubPortfolio.equals("Create A New Sub-portfolio"));

        String disabledCreateBtn = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertTrue(disabledCreateBtn.equals("true"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div/div[2]/form/div[1]/div/input")).sendKeys("Jordans Sub-Portfolio7");

        String disabledCreateBtn2 = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertTrue(disabledCreateBtn2.equals("true"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div/div[2]/form/div[2]/div/input")).sendKeys("AA1238476362635437");

        wait.until(elementToBeClickable(By.xpath("//*[@id=\"override_save\"]")));


        driver.findElement(By.xpath("//*[@id=\"override_save\"]")).click();

        Thread.sleep(12500);

        String subPortfolioNameDataGrid = driver.findElement(By.cssSelector("div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row:nth-child(1) > div > clr-dg-cell:nth-child(1) > span")).getText();
        System.out.println(subPortfolioNameDataGrid);
        assertTrue(subPortfolioNameDataGrid.equals("Jordans Sub-Portfolio7"));

        String subPortfolioIBANDataGrid = driver.findElement(By.cssSelector("div > clr-datagrid > div > div > div > clr-dg-table-wrapper > div.datagrid-body > clr-dg-row:nth-child(1) > div > clr-dg-cell:nth-child(2) > span")).getText();
        System.out.println(subPortfolioIBANDataGrid);
        assertTrue(subPortfolioIBANDataGrid.equals("AA1238476362635437"));
    }

    public static void setSharesNAVandValidate(String shareName, int navValue) throws IOException, InterruptedException{
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        navigateToNAVPageFromFunds();
        driver.findElement(By.id("Search-field")).sendKeys(shareName);
        wait.until(visibilityOfElementLocated(By.id("Btn-AddNewNAV-0")));
        wait.until(elementToBeClickable(By.id("Btn-AddNewNAV-0")));
        driver.findElement(By.id("Btn-AddNewNAV-0")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3/span")));
        String NAVpopupTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3/span")).getText();
        assertTrue(NAVpopupTitle.equals("Add New NAV"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).clear();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).sendKeys("" + navValue);
        searchAndSelectTopDropdown("Status-nav-btn", "Validated");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[3]/button[2]")).click();

        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));

        String successSubText = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[3]/table/tbody/tr/td")).getText();
        assertTrue(successSubText.equals("Successfully Updated NAV"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")));

        try {
            String TableNav = driver.findElement(By.id("NAV-Value-0")).getText();
            System.out.println(TableNav);
            System.out.println(navValue + ".00");
            assertTrue(TableNav.equals(navValue + ".00"));
        } catch (Error e) {
            fail(e.getMessage());
        }
        logout();
    }

    @Test
    @Ignore
    public void shouldTestEntireFundFlow2() throws InterruptedException, SQLException, IOException {

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToKYCPage();

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/h2")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/i")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid")));
        String reviewedByColumn = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row//*[text()[contains(.,'FundFlow')]]/parent::clr-dg-cell")).getAttribute("id");
        System.out.println(reviewedByColumn);
        int clientRowNo = Integer.parseInt(reviewedByColumn.replaceAll("[\\D]", ""));
        System.out.println(clientRowNo);
        driver.findElement(By.xpath("//*[@id=\"AllClients-Status-KYC-" + clientRowNo + "\"]/a")).click();

        wait.until(visibilityOfElementLocated(By.id("clr-tab-content-0")));

        driver.findElement(By.id("checkbox")).click();

        try {
            wait.until(elementToBeClickable(By.id("submitButton")));
            driver.findElement(By.id("submitButton")).click();
        } catch (Exception e) {
            fail(e.getMessage());
        }

        wait.until(visibilityOfElementLocated(By.id("companyName")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")));

        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")).click();

        try {
            wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
            String confirmAccessTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(confirmAccessTitle.equals("Confirm Fund Share Access:"));
        } catch (Exception e) {
            fail("FAILED : " + e.getMessage());
        }

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        try {
            String permissionToaster = driver.findElement(By.className("toast-title")).getText();
            assertTrue(permissionToaster.equals("Share Permissions Saved"));
        } catch (Exception e) {
            fail(e.getMessage());
        }
    }
}
