package com.setl.openCSDClarityTests.UI.Iznes1SanityTests;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.SQLException;

import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.generateRandomISIN;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.getShareTableRow;
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

    JavascriptExecutor jse = (JavascriptExecutor)driver;


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
    }

    @Test
    public void shouldTestEntireFundFlow() throws InterruptedException, SQLException, IOException {

        /////////////////////////////////////////////////////////////////////////
        ///////////////                FUNDS             ////////////////////////
        /////////////////////////////////////////////////////////////////////////

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        String [] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], "16616758475934857598");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        String fundCountXpath = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[3]/div[1]/div[1]/a/h2")).getText();
        int fundCount = Integer.parseInt(fundCountXpath.replaceAll("[\\D]", ""));
        String [] uFundDetails = generateRandomFundsDetails();
        fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetailsStep2(uFundDetails[0], "16615748475934658598");

        getFundTableRow(fundCount, uFundDetails[0], "16615748475934658598", "EUR Euro", "Management Company", "Afghanistan","Contractual Fund", umbFundDetails[0]);

        String shareCountXpathPre = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/app-ofi-am-product-home/div[4]/div[1]/div[1]/a/h2")).getText();
        int shareCountPre = Integer.parseInt(shareCountXpathPre.replaceAll("[\\D]", ""));
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

        /////////////////////////////////////////////////////////////////////////
        ////////////////                NAV             /////////////////////////
        /////////////////////////////////////////////////////////////////////////

        int rowNo = 0;
        int setNav = 14;

//        loginAndVerifySuccess("am", "alex01");
//        waitForHomePageToLoad();
//        navigateToDropdown("menu-my-products");
//        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

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
        }catch (Error e){
            fail(e.getMessage());
        }
        logout();

        /////////////////////////////////////////////////////////////////////////
        ////////////////                KYC             /////////////////////////
        /////////////////////////////////////////////////////////////////////////

        loginAndVerifySuccessKYC("testops004@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops004@setl.io", "FundFlow", "Testing");
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
        String reviewedByColumn = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div[1]/div/ng-component/div[8]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row//*[text()[contains(.,'FundFlow')]]/parent::clr-dg-cell")).getAttribute("id");
        System.out.println(reviewedByColumn);
        int clientRowNo = Integer.parseInt(reviewedByColumn.replaceAll("[\\D]", ""));
        System.out.println(clientRowNo);
        driver.findElement(By.xpath("//*[@id=\"AllClients-Status-KYC-" + clientRowNo + "\"]/a")).click();

        wait.until(visibilityOfElementLocated(By.id("clr-tab-content-0")));

        driver.findElement(By.id("checkbox")).click();

        try{
            wait.until(elementToBeClickable(By.id("submitButton")));
            driver.findElement(By.id("submitButton")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }

        wait.until(visibilityOfElementLocated(By.id("companyName")));
//        System.out.println(uIsin[0] + "-access");
//        Thread.sleep(2500);
//
//        driver.findElement(By.id(uIsin[0] + "-access")).click();
//        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")));
//        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")).click();
//
//        try{
//            wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
//            String confirmAccessTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
//            assertTrue(confirmAccessTitle.equals("Confirm Fund Share Access:"));
//        }catch (Exception e){
//            fail("FAILED : " + e.getMessage());
//        }

        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-confirmations/jaspero-confirmation/div[2]/div[4]/button[2]")).click();

        try {
            String permissionToaster = driver.findElement(By.className("toast-title")).getText();
            assertTrue(permissionToaster.equals("Share Permissions Saved"));
        } catch (Exception e) {
            fail(e.getMessage());
        }


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

        try{
            wait.until(elementToBeClickable(By.id("submitButton")));
            driver.findElement(By.id("submitButton")).click();
        }catch (Exception e){
            fail(e.getMessage());
        }

        wait.until(visibilityOfElementLocated(By.id("companyName")));

        System.out.println("1661232" + "-access");
        Thread.sleep(2500);

        driver.findElement(By.xpath("//*[@id=\'" + "1661232" + "-access\']")).click();
        wait.until(elementToBeClickable(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")));
        driver.findElement(By.xpath("//*[@id=\"clr-tab-content-6\"]/div/div[3]/form/div[2]/button[2]")).click();

        try{
            wait.until(visibilityOfElementLocated(By.className("jaspero__dialog-title")));
            String confirmAccessTitle = driver.findElement(By.className("jaspero__dialog-title")).getText();
            assertTrue(confirmAccessTitle.equals("Confirm Fund Share Access:"));
        }catch (Exception e){
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
