package com.setl.openCSDClarityTests.UI.Iznes4General;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;
import java.sql.*;

import static SETLAPIHelpers.DatabaseHelper.setDBToProdOff;
import static SETLAPIHelpers.DatabaseHelper.setDBToProdOn;
import static SETLAPIHelpers.DatabaseHelper.validateDatabaseUmbrellaFundExists;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyFundOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyOptInfoPageContents;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes1MyProduct.Funds.OpenCSD2FundsAcceptanceTest.validateDatabaseShareExists;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAnInvestor;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.navigateToInviteInvestorPage;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDSprint7AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (65000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    static Connection conn = null;

    public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

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
    public void shouldInviteInvestorAndCheckDBTG659() throws InterruptedException, SQLException {
        String investorEmail = "jordan.miller2@setl.io";

        validateDatabaseInvestorInvited(0, investorEmail);

        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor(investorEmail, "Jordan", "Miller", "Success!");

        validateDatabaseInvestorInvited(1, investorEmail);

    }
    @Test
    public void shouldAssertTrueInvitesRecapTG658() throws InterruptedException {
        String investorEmail = "michael.bindley@setl.io";

        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor(investorEmail, "Michael", "Bindley", "Success!");

        String email = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-invite-investors/div[2]/section/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[2]/clr-dg-row[1]/div/clr-dg-cell[3]")).getText();
        assertTrue(email.equals(investorEmail));

    }

    @Test
    public void shouldHaveNextAndPreviousButtonsTG1090() throws IOException, InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        String randomLEI = "16614748475934658531";

        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("none");
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShareWithoutCharacteristics(uFundDetails[0], uShareDetails[0], uIsin[0]);

        assertTrue(driver.findElement(By.id("nextTab")).isDisplayed());
        assertTrue(driver.findElement(By.id("previousTab")).isDisplayed());

        String disabledPrev = driver.findElement(By.id("previousTab")).getAttribute("disabled");
        assertTrue(disabledPrev.equals("true"));
        assertTrue(driver.findElement(By.id("fundShareName")).isDisplayed());
        wait.until(elementToBeClickable(By.id("nextTab")));
        scrollElementIntoViewById("nextTab");
        wait.until(visibilityOfElementLocated(By.id("nextTab")));
        wait.until(elementToBeClickable(By.id("nextTab")));
        driver.findElement(By.id("nextTab")).click();
        wait.until(visibilityOfElementLocated(By.id("maximumNumDecimal")));

        driver.findElement(By.id("tabDocumentsButton")).click();
        wait.until(visibilityOfAllElementsLocatedBy(By.id("prospectus")));

        String disabledNext = driver.findElement(By.id("nextTab")).getAttribute("disabled");
        assertTrue(disabledNext.equals("true"));
        assertTrue(driver.findElement(By.id("prospectus")).isDisplayed());
        driver.findElement(By.id("previousTab")).click();
        wait.until(visibilityOfElementLocated(By.id("toggleSolvencyOptional")));


    }

    @Test
    public void shouldHaveLogoutButtonOnNavTG1052() throws IOException, InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        loginAndVerifySuccess("am", "alex01");
        wait.until(visibilityOfAllElementsLocatedBy(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[2]/a")));
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[2]/a")).isDisplayed());
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[2]/a")).click();

        wait.until(visibilityOfAllElementsLocatedBy(By.id("username-field")));
        assertTrue(driver.findElement(By.id("username-field")).isDisplayed());
    }

    @Test
    public void shouldPopupAfterUmbrellaCreationTG1027() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        selectAddUmbrellaFund();
        String [] uFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(uFundDetails[0], "16616758475934857432");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        assertPopupNextFundNo("Fund");
    }

    @Test
    public void shouldPopupAfterFundCreationTG1028() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        selectAddUmbrellaFund();
        String [] umbFundDetails = generateRandomUmbrellaFundsDetails();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], "16616758475934858531");
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");

        String [] uFundDetails = generateRandomFundsDetails();
        fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetailsStep2(uFundDetails[0], "16616758475934858531");

        assertPopupNextFundNo("Share");
    }

    @Test
    public void shouldApplySelectedFilterOnNavigationMenuTG1097() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String navlinkactive = driver.findElement(By.id("menu-product-home")).getAttribute("class");
        assertTrue(navlinkactive.equals("nav-link active"));
        driver.findElement(By.id("menu-nav")).click();
        assertTrue(driver.findElement(By.id("menu-product-home")).getAttribute("class").equals("nav-link"));
    }

    @Test
    public void shouldNavigateToCentralisationHistoryPageTG1079() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-am-report-section");
        navigateToPageByID("menu-report-centralization-select");
        verifyCorrectPage("Centralisation History");

    }

    @Test
    @Ignore("need more KYC users")
    public void shouldShowPopUpMoreInformationKYCTG1108() throws InterruptedException, SQLException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String compName = "JDN Corp";

        loginAndVerifySuccessKYC("testops001@setl.io", "asdasd", "additionnal");
        fillKYCTopFields("testops001@setl.io", "Test", "Investor");
        fillKYCLowerFields(compName, "07956701992");
        saveKYCAndVerifySuccessPageOne();
        selectOptionAndSubmitKYC("yes");
        logout();
        loginAndVerifySuccess("am", "alex01");
        navigateToKYCPage();

        wait.until(visibilityOfAllElementsLocatedBy(By.id("Waiting-Expandable-KYC")));
        driver.findElement(By.xpath("//*[@id=\"Waiting-Expandable-KYC\"]/h2")).click();
        wait.until(elementToBeClickable(By.id("Waiting-Status-KYC-0")));
        driver.findElement(By.id("Waiting-Status-KYC-0")).click();
        wait.until(visibilityOfAllElementsLocatedBy(By.id("companyName")));
        String test = driver.findElement(By.id("companyName")).getAttribute("value");
        assertTrue(test.equals(compName));
        driver.findElement(By.id("askForMoreInfo")).click();
        driver.findElement(By.id("checkbox")).click();
        wait.until(elementToBeClickable(By.id("submitButton")));
        driver.findElement(By.id("submitButton")).click();

    }

    @Test
    public void AssertPageDataForCentralisationHistoryTG1080() throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] umbFundDetails = generateRandomUmbrellaFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uFundDetails = generateRandomUmbrellaFundsDetails();
        String[] uIsin = generateRandomISIN();
        String randomLEI = "16616758475934857531";

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry(umbFundDetails[0], randomLEI);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        fillOutFundDetailsStep1(umbFundDetails[0]);
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);
        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        navigateToDropdown("menu-am-report-section");
        navigateToPageByID("menu-report-centralization-select");

        driver.findElement(By.id("menu-report-centralization-select")).click();
        String CentralHeader = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/h1")).getText();
        assertTrue(CentralHeader.equals("Centralisation History"));
        wait.until(elementToBeClickable(By.cssSelector("i.special:nth-child(3)")));
        driver.findElement(By.cssSelector("i.special:nth-child(3)")).click();
        wait.until(elementToBeClickable(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/clr-tabs/clr-tab/clr-tab-content/ng-select/div/div[3]/div/input")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/clr-tabs/clr-tab/clr-tab-content/ng-select/div/div[3]/div/input")).sendKeys(uShareDetails[0]);

        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-15\"]/ng-select/div/div[3]/ul/li[2]")));

        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/clr-tabs/clr-tab/clr-tab-content/ng-select/div/div[3]/ul/li[1]/div/a")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/clr-tabs/clr-tab/clr-tab-content/ng-select/div/div[3]/ul/li[1]/div/a")).click();


        String ShareName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/form/div/div/div/div/ng-select/div/div[2]/span/span")).getText();
        assertTrue(ShareName.equals(uShareDetails[0]));
        String FundName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/div[2]/form/table[1]/tbody/tr/td[1]/div/div")).getText();
        assertTrue(FundName.equals(uFundDetails[0]));

        String CCY = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/div[2]/form/table[1]/tbody/tr/td[3]/div/div")).getText();
        assertTrue(CCY.equals("EUR"));
        String Umbrella = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/div[2]/form/table[1]/tbody/tr/td[2]/div/div")).getText();
        assertTrue(Umbrella.equals(umbFundDetails[0]));
        driver.findElement(By.xpath("//*[@id=\"export-centralization-btn\"]")).isDisplayed();
        driver.findElement(By.xpath("//*[@id=\"holders-btn-back-list\"]")).isDisplayed();
    }

    @Test
    public void ShareAuditTrailHeaderContainsShareNameTG447() throws Exception {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        String randomLEI = "16614748475934658531";

        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("none");
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);

        wait.until(invisibilityOfElementLocated(By.className("toast-title")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/button")).click();
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")).click();
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/input")).sendKeys(uShareDetails[0]);
        wait.until(invisibilityOfElementLocated(By.id("product-dashboard-fundShareID-1-shareName")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-home/div[4]/div[2]/div/clr-datagrid/div/div/div/clr-dg-table-wrapper/div[1]/div/clr-dg-column[1]/div/clr-dg-string-filter/clr-dg-filter/div/div/button")).click();
        wait.until(elementToBeClickable(By.id("product-dashboard-fundShareID-0-shareName")));
        driver.findElement(By.id("product-dashboard-fundShareID-0-shareName")).click();
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-am-product-fund-share/clr-tabs/clr-tab/clr-tab-content/div[1]/div/button")).click();
        String HeaderShareName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-product-fund-share-audit/div/h1")).getText();
        assertTrue(HeaderShareName.equals("Share Audit Trail - " + uShareDetails[0]));
    }

    @Test
    public void ShouldValidateNetAssetValueAuditTrailHeading() throws Exception {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomFundsDetails();
        String[] uIsin = generateRandomISIN();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("none");
        fillOutFundDetailsStep2(uFundDetails[0], "16615748475934658531");
        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);

        navigateToNAVPageFromFunds();
        wait.until(visibilityOfElementLocated(By.id("NAV-Share-Name-0")));
        String ShareNameNAV = driver.findElement(By.id("NAV-Share-Name-0")).getText();
        assertTrue(ShareNameNAV.equals(uShareDetails[0]));
        driver.findElement(By.id("NAV-Share-Name-0")).click();
        wait.until(visibilityOfElementLocated(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-fund-view/clr-tabs/clr-tab/clr-tab-content/form[2]/div/div/div[5]/button[2]")));
        driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-nav-fund-view/clr-tabs/clr-tab/clr-tab-content/form[2]/div/div/div[5]/button[2]")).click();

        String NAVAuditTrail = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-product-nav-audit/div/h1")).getText();
        assertTrue(NAVAuditTrail.equals("NAV Audit Trail - " + uShareDetails[0]));
    }

    public static void validateDatabaseInvestorInvited ( int expectedCount, String UInvestorEmail) throws SQLException {
        conn = DriverManager.getConnection(connectionString, DBUsername, DBPassword);
        //for the query
        Statement stmt = conn.createStatement();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("select * from setlnet.tblIznInvestorInvitation where email =  " + "\"" + UInvestorEmail + "\"");
            int rows = 0;

            if (rs.last()) {
                rows = rs.getRow();
                // Move to back to the beginning

                rs.beforeFirst();
            }
            assertEquals("There should be exactly " + expectedCount + " record(s) matching (ignoring case): ", expectedCount, rows);
        } catch (Exception e) {
            e.printStackTrace();
            fail();
        } finally {
            conn.close();
            stmt.close();
            rs.close();
        }
    }

}
