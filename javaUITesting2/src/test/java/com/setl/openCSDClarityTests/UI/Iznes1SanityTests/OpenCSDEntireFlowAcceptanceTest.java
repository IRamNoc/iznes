package com.setl.openCSDClarityTests.UI.Iznes1SanityTests;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

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
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageContains;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.KYCProcessStep3BankingInfoComplete;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.KYCProcessStep3CompanyInfoComplete;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.KYCProcessStep3GeneralInfoComplete;
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
        String umbLei = "16616758475934857598";
        String fundLei = "16616758475934857522";

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
        getShareTableRow(0, uShareDetails[0], uIsin[0], uFundDetails[0], "EUR", "Management Company", "", "share class", "Open");

        setSharesNAVandValidate(uShareDetails[0], 14);

        String No = "10";
        String userNo = "0" + No;
        String managementCompEntered = "Management Company";
        String companyName = "Jordan Corporation";
        String firstName = "Jordan";
        String lastName = "Miller";
        String phoneNo = "07956701992";

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

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String clientRefTitle = driver.findElement(By.xpath("//*[@id=\"ofi-client-referential\"]")).getText();
        System.out.println(clientRefTitle);
        System.out.println("Client Referential: " + companyName + "-" + No);
        assertTrue(clientRefTitle.equals("Client Referential: " + companyName + "-" + No));

        driver.findElement(By.id("clr-tab-link-10")).click();

        driver.findElement(By.xpath("//*[@id=\"client_folder_isin_number\"]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        Thread.sleep(250);
        driver.findElement(By.xpath("//*[@id=\"client_folder_isin_number\"]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(uIsin[0]);
        Thread.sleep(250);
        driver.findElement(By.xpath("//*[@id=\"client_folder_isin_number\"]/div/clr-dg-string-filter/clr-dg-filter/button")).click();

        driver.findElement(By.id("access_slider_0")).click();

        scrollElementIntoViewById("client_folder_validate");
        driver.findElement(By.id("client_folder_validate")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]")));
        String jaspTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
        assertTrue(jaspTitle.equals("Confirm Fund Share Access:"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        wait.until(visibilityOfElementLocated(By.id("invite-investors-btn")));
        wait.until(elementToBeClickable(By.id("invite-investors-btn")));
        logout();

        loginAndVerifySuccess("testops" + userNo + "@setl.io", "asdasd");
        navigateToPageByID("menu-sub-portfolio");
        verifyCorrectPageContains("sub-portfolio");

        driver.findElement(By.id("btn-add-new-subportfolio")).click();
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div")));
        String modalTitleSubPortfolio = driver.findElement(By.id("override_header")).getText();
        assertTrue(modalTitleSubPortfolio.equals("Create a new sub-portfolio"));

        String disabledCreateBtn = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertTrue(disabledCreateBtn.equals("true"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div/div[2]/form/div[1]/div/input")).sendKeys("Jordans Sub-Portfolio");

        String disabledCreateBtn2 = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertTrue(disabledCreateBtn2.equals("true"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ofi-sub-portfolio/clr-modal[1]/div/div[1]/div/div[1]/div/div[2]/form/div[2]/div/input")).sendKeys("AA1238476362635433");

        String disabledCreateBtn3 = driver.findElement(By.xpath("//*[@id=\"override_save\"]")).getAttribute("disabled");
        assertFalse(disabledCreateBtn3.equals("true"));

        driver.findElement(By.xpath("//*[@id=\"override_save\"]")).click();

        Thread.sleep(2500);

        String subPortfolioNameDataGrid = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-9\"]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[1]/span")).getText();
        assertTrue(subPortfolioNameDataGrid.equals("Jordans Sub-Portfolio"));

        String subPortfolioIBANDataGrid = driver.findElement(By.xpath("//*[@id=\"clr-tab-content-9\"]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row/div/clr-dg-cell[2]/span")).getText();
        assertTrue(subPortfolioIBANDataGrid.equals("AA1238476362635433"));

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
