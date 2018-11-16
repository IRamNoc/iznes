package com.setl.openCSDClarityTests.UI.Iznes4General;

import com.setl.UI.common.SETLBusinessData.IBAN;
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

import static SETLAPIHelpers.DatabaseHelper.*;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAnInvestor;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.navigateToInviteInvestorPage;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDSprint7AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (105000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    //static Connection conn = null;

    //public static String connectionString = "jdbc:mysql://localhost:9998/setlnet?nullNamePatternMatchesAll=true";

    // Defines username and password to connect to database server.
    static String DBUsername = "root";
    static String DBPassword = "nahafusi61hucupoju78";

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
    public void shouldInviteInvestorAndCheckDBTG659() throws InterruptedException, SQLException, IOException {
        String investorEmail = "jordan.miller1@setl.io";

        //validateDatabaseInvestorInvited(0, investorEmail);

        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor(investorEmail, "Jordan", "Miller", "Success!", "Institutional Investor");

        //validateDatabaseInvestorInvited(1, investorEmail);

    }
    @Test
    public void shouldAssertTrueInvitesRecapTG658() throws InterruptedException, IOException {
        String investorEmail = "michael.bindley@setl.io";

        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor(investorEmail, "Michael", "Bindley", "Success!", "Institutional Investor");

        String email = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/jaspero-alerts/jaspero-alert/div[2]/div[3]/table")).getText();
        assertTrue(email.equals(investorEmail));
    }

    @Test
    public void shouldHaveNextAndPreviousButtonsTG1090() throws IOException, InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        String randomLEI = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShareWithoutCharacteristics(uFundDetails[0], uShareDetails[0], uIsin[0]);

        assertTrue(driver.findElement(By.id("nextTab")).isDisplayed());
        assertTrue(driver.findElement(By.id("previousTab")).isDisplayed());
        assertTrue(driver.findElement(By.id("previousTab")).getAttribute("disabled").equals("true"));
        assertTrue(driver.findElement(By.id("fundShareName")).isDisplayed());
        scrollElementIntoViewById("nextTab");
        wait.until(visibilityOfElementLocated(By.id("nextTab")));
        wait.until(elementToBeClickable(By.id("nextTab")));
        driver.findElement(By.id("nextTab")).click();
        wait.until(visibilityOfElementLocated(By.id("maximumNumDecimal")));

        driver.findElement(By.id("tabDocumentsButton")).click();
        wait.until(visibilityOfAllElementsLocatedBy(By.id("prospectus")));

        assertTrue(driver.findElement(By.id("nextTab")).getAttribute("disabled").equals("true"));
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
    public void shouldPopupAfterUmbrellaCreationTG1027() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        selectAddUmbrellaFund();
        String uFundDetails = generateRandomUmbrellaFundName();
        fillUmbrellaDetailsNotCountry(uFundDetails, generateRandomLEI());
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();

        assertPopupNextFundNo("Fund");
    }

    @Test
    public void shouldPopupAfterFundCreationTG1028() throws InterruptedException, SQLException, IOException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        selectAddUmbrellaFund();
        String  umbFundDetails = generateRandomUmbrellaFundName();
        String lei = generateRandomLEI();
        fillUmbrellaDetailsNotCountry(umbFundDetails, lei);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");

        String [] uFundDetails = generateRandomFundsDetails();
        String lei2 = generateRandomLEI();
        fillOutFundDetailsStep1("yes", umbFundDetails);
        fillOutFundDetailsStep2(uFundDetails[0], lei2);

        assertPopupNextFundNo("Share");
    }

    @Test
    public void shouldApplySelectedFilterOnNavigationMenuTG1097() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        String navlinkactive = driver.findElement(By.id("menu-product-home")).getAttribute("class");
        assertEquals("nav-link ng-star-inserted active", navlinkactive);
        driver.findElement(By.id("menu-nav")).click();
        assertEquals("nav-link ng-star-inserted active", driver.findElement(By.id("menu-nav")).getAttribute("class"));
    }

    @Test
    public void shouldNavigateToCentralisationHistoryPageTG1079() throws InterruptedException, SQLException {
        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-am-report-section");
        navigateToPageByID("menu-report-centralisation-select");
        verifyCorrectPage("Centralisation");

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
    @Ignore("centralisation being changed")
    public void AssertPageDataForCentralisationHistoryTG1080() throws InterruptedException, SQLException, IOException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String umbFundDetails = generateRandomUmbrellaFundName();
        String[] uShareDetails = generateRandomShareDetails();
        String uFundDetails = generateRandomUmbrellaFundName();
        String[] uIsin = generateRandomISIN();
        String randomLEI = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        selectAddUmbrellaFund();
        fillUmbrellaDetailsNotCountry(umbFundDetails, randomLEI);
        searchAndSelectTopDropdownXpath("uf_domicile", "Jordan");
        submitUmbrellaFund();
        assertPopupNextFundNo("Fund");
        fillOutFundDetailsStep1("yes",umbFundDetails);
        fillOutFundDetailsStep2(uFundDetails, randomLEI);
        assertPopupNextFundNo("Share");
        createShare(uFundDetails, uShareDetails[0], uIsin[0], IBAN.generateRandomIban("FR"));
        navigateToDropdown("menu-am-report-section");
        navigateToPageByID("menu-report-centralisation-select");

        driver.findElement(By.id("menu-report-centralisation-select")).click();
        String CentralHeader = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/h1")).getText();
        assertTrue(CentralHeader.equals("Centralisation"));
        wait.until(elementToBeClickable(By.cssSelector("i.special:nth-child(3)")));
        driver.findElement(By.cssSelector("i.special:nth-child(3)")).click();
        wait.until(elementToBeClickable(By.cssSelector("input.form-control")));
        driver.findElement(By.cssSelector("input.form-control")).sendKeys(uFundDetails);

        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"clr-tab-content-15\"]/ng-select/div/div[3]/ul/li[2]")));

        wait.until(visibilityOfElementLocated(By.cssSelector(".ui-select-choices-row")));
        driver.findElement(By.cssSelector(".ui-select-choices-row > a:nth-child(1) > div:nth-child(1)")).click();


        String ShareName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/form/div/div/div/div/ng-select/div/div[2]/span/span")).getText();
        assertTrue(ShareName.equals(uShareDetails[0]));
        String FundName = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/div[2]/form/table[1]/tbody/tr/td[1]/div/div")).getText();
        assertTrue(FundName.equals(uFundDetails));

        String CCY = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/div[2]/form/table[1]/tbody/tr/td[3]/div/div")).getText();
        assertTrue(CCY.equals("EUR"));
        String Umbrella = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-am-centralization-history/div[2]/clr-tabs/clr-tab/clr-tab-content/div[2]/form/table[1]/tbody/tr/td[2]/div/div")).getText();
        assertTrue(Umbrella.equals(umbFundDetails));
        driver.findElement(By.xpath("//*[@id=\"export-centralization-btn\"]")).isDisplayed();
        driver.findElement(By.xpath("//*[@id=\"holders-btn-back-list\"]")).isDisplayed();
    }

    @Test
    public void ShareAuditTrailHeaderContainsShareNameTG447() throws Exception {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String[] uFundDetails = generateRandomFundsDetails();
        String randomLEI = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], randomLEI);
        assertPopupNextFundNo("Share");
        searchFundsTable(uFundDetails[0]);
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0], IBAN.generateRandomIban("FR"));
        searchSharesTable(uShareDetails[0]);

        wait.until(invisibilityOfElementLocated(By.id("product-dashboard-fundShareID-1-shareName")));
        wait.until(elementToBeClickable(By.id("product-dashboard-fundShareID-0-shareName")));
        driver.findElement(By.id("product-dashboard-fundShareID-0-shareName")).click();
    }

    @Test
    public void ShouldValidateNetAssetValueAuditTrailHeading() throws Exception {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);

        String[] uFundDetails = generateRandomFundsDetails();
        String[] uShareDetails = generateRandomShareDetails();
        String[] uIsin = generateRandomISIN();
        String lei = generateRandomLEI();

        loginAndVerifySuccess("am", "alex01");
        waitForHomePageToLoad();
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");

        fillOutFundDetailsStep1("no","none");
        fillOutFundDetailsStep2(uFundDetails[0], lei);

        assertPopupNextFundNo("Share");
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0], IBAN.generateRandomIban("FR"));

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


}
