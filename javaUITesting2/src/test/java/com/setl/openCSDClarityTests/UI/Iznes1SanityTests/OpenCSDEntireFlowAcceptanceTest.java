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
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.getShareTableRow;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.waitForNewShareButton;
import static com.setl.UI.common.SETLUIHelpers.SetUp.driver;
import static com.setl.UI.common.SETLUIHelpers.SetUp.testSetUp;
import static com.setl.UI.common.SETLUIHelpers.SetUp.timeoutInSeconds;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationProfile;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.shareCreationSubmit;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;
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
    public Timeout globalTimeout = new Timeout(120000);
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
    @Ignore("KYC PROCESS BEING UPDATED")
    public void shouldTestEntireFundFlow() throws InterruptedException, SQLException, IOException {

        /////////////////////////////////////////////////////////////////////////
        ///////////////                FUNDS             ////////////////////////
        /////////////////////////////////////////////////////////////////////////

        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        int rowNo = 0;
        int setNav = 14;
        String umbLei = "16616758475934857598";
        String fundLei = "16616758475934857522";

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String[] umbFundDetails = generateRandomUmbrellaFundsDetails();
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

        /////////////////////////////////////////////////////////////////////////
        ////////////////                NAV             /////////////////////////
        /////////////////////////////////////////////////////////////////////////

        navigateToNAVPageFromFunds();
        wait.until(visibilityOfElementLocated(By.id("Btn-AddNewNAV-" + rowNo)));
        wait.until(elementToBeClickable(By.id("Btn-AddNewNAV-" + rowNo)));
        driver.findElement(By.id("Btn-AddNewNAV-" + rowNo)).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3/span")));
        String NAVpopupTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[1]/h3/span")).getText();
        assertTrue(NAVpopupTitle.equals("Add New NAV"));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).clear();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[2]/form/div/div[4]/input")).sendKeys("" + setNav);
        searchAndSelectTopDropdown("Status-nav-btn", "Validated");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-manage-list/app-nav-add/clr-modal/div/div[1]/div/div[1]/div/div[3]/button[2]")).click();

        wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));

        String successSubText = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[3]/table/tbody/tr/td")).getText();
        assertTrue(successSubText.equals("Successfully Updated NAV"));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")).click();
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[4]/button")));

        try {
            String TableNav = driver.findElement(By.id("NAV-Value-" + rowNo)).getText();
            System.out.println(TableNav);
            System.out.println(setNav + ".00");
            assertTrue(TableNav.equals(setNav + ".00"));
        } catch (Error e) {
            fail(e.getMessage());
        }
        logout();

        /////////////////////////////////////////////////////////////////////////
        ////////////////                KYC             /////////////////////////
        /////////////////////////////////////////////////////////////////////////

        JavascriptExecutor js = (JavascriptExecutor)driver;
        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops001@setl.io", "FundFlow", "Testing");
        fillKYCLowerFields("JORDAN Developments Ltd", "07956701992");
        saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("yes");
        logout();

        loginAndVerifySuccess("am", "alex01");
        navigateToKYCPage();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/h2")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div[8]/div[1]/div/a/i")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid")));
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid")));
        driver.findElement(By.id("AllClients-Status-KYC-0")).click();

        driver.findElement(By.id("checkbox")).click();

        try {
            wait.until(elementToBeClickable(By.id("submitButton")));
            driver.findElement(By.id("submitButton")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }

        wait.until(visibilityOfElementLocated(By.id("companyName")));

        try {
            Thread.sleep(750);
            js.executeScript("document.getElementById('" + uIsin[0] + "-access').click();");
        }catch (Exception e){
            fail(e.getMessage());
        }

        try {
            scrollElementIntoViewById("client_folder_validate");
            wait.until(visibilityOfElementLocated(By.id("client_folder_validate")));
            wait.until(elementToBeClickable(driver.findElement(By.id("client_folder_validate"))));
        }catch (Exception e){
            fail(e.getMessage());
        }

        driver.findElement(By.id("client_folder_validate")).click();

        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]")));
        String popupTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[1]")).getText();
        assertTrue(popupTitle.equals("Confirm Fund Share Access:"));

        String popupFundName = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]/table/tbody/tr[2]/td[1]")).getText();
        assertTrue(popupFundName.equals(uFundDetails[0]));

        String popupShareName = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]/table/tbody/tr[2]/td[2]")).getText();
        assertTrue(popupShareName.equals(uShareDetails[0]));

        String popupISIN = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[3]/table/tbody/tr[2]/td[3]")).getText();
        assertTrue(popupISIN.equals(uIsin[0]));

        wait.until(invisibilityOfElementLocated(By.className("toast-title")));

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        String permissionToaster = driver.findElement(By.className("toast-title")).getText();
        System.out.println(permissionToaster);
        System.out.println("Share Permissions Saved");
        assertTrue(permissionToaster.equals("Share Permissions Saved"));


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
