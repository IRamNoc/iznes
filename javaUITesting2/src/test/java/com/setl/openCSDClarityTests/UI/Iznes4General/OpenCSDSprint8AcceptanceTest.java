package com.setl.openCSDClarityTests.UI.Iznes4General;

import com.setl.UI.common.SETLUtils.Repeat;
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
import static SETLAPIHelpers.DatabaseHelper.validateTimeZoneUpdate;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.navigateToDropdown;
import static com.setl.UI.common.SETLUIHelpers.FundsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.scrollElementIntoViewById;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.validateCSSOnNavigationBarByID;
import static com.setl.UI.common.SETLUIHelpers.MemberDetailsHelper.validateColourOfElementByCSS;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.UmbrellaFundFundSharesDetailsHelper.*;
import static com.setl.openCSDClarityTests.UI.Iznes2KYCModule.OpenCSDKYCModuleAcceptanceTest.*;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.inviteAnInvestor;
import static com.setl.openCSDClarityTests.UI.Iznes4General.OpenCSDGeneralAcceptanceTest.navigateToInviteInvestorPage;
import static org.junit.Assert.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.*;


@RunWith(OrderedJUnit4ClassRunner.class)

public class OpenCSDSprint8AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (95000);
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
    public void shouldAssertBankHolidaysScreenTG947() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-config");
        String pageTitle = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/app-ofi-product-configuration/div/h1")).getText();
        assertTrue(pageTitle.equals("Configuration"));
    }

    @Test
    public void shouldUpdateShareCutOffTimeZoneTG1209() throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        String[] uShareDetails = generateRandomFundsDetails();
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
        createShare(uFundDetails[0], uShareDetails[0], uIsin[0]);
        searchSharesTable(uShareDetails[0]);
        driver.findElement(By.id("product-dashboard-link-fundShareID-0")).click();
        wait.until(visibilityOfElementLocated(By.id("tabCalendarButton"))).isDisplayed();
        driver.findElement(By.id("tabCalendarButton")).click();
        String CurrentTimeZone = driver.findElement(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[2]/span/span")).getText();
        assertTrue(CurrentTimeZone.equals("Africa/Abidjan"));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[2]/span/i[2]"))).click();
        driver.findElement(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[3]/div/input")).sendKeys("Europe/London");
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[3]/ul/li[3]")));
        String TimeZone = driver.findElement(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[3]/ul/li/div/a/div")).getText();
        assertTrue(TimeZone.equals("Europe/London"));
        driver.findElement(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[3]/ul/li/div/a/div")).click();
        scrollElementIntoViewById("saveFundShareBottom");
        wait.until(visibilityOfElementLocated(By.id("saveFundShareBottom")));
        wait.until(elementToBeClickable(By.id("saveFundShareBottom")));
        Thread.sleep(750);
        driver.findElement(By.id("saveFundShareBottom")).click();
        searchSharesTable(uShareDetails[0]);
        driver.findElement(By.id("product-dashboard-link-fundShareID-0")).click();
        wait.until(visibilityOfElementLocated(By.id("tabCalendarButton"))).isDisplayed();
        driver.findElement(By.id("tabCalendarButton")).click();
        String currentTimeZoneUpdate = driver.findElement(By.xpath("//*[@id=\"subscriptionCutOffTimeZone\"]/div/div[2]/span/span")).getText();
        assertTrue(currentTimeZoneUpdate.equals("Europe/London"));
        String fundShareName = uShareDetails[0];
        validateTimeZoneUpdate(fundShareName, currentTimeZoneUpdate);
    }

    @Test
    public void shouldShowDataGridOnHomePageTG1376() throws InterruptedException, SQLException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        loginAndVerifySuccess("am", "alex01");
        validateCSSOnNavigationBarByID("menu-home");
        String Home = driver.findElement(By.id("menu-home")).getText();
        assertTrue(Home.equals(Home));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[2]/div/ng-select/div/div[2]/span/i[2]")).click();
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[2]/div/ng-select/div/div[3]/div/input")).sendKeys("AssetManagerWallet");
        wait.until(invisibilityOfElementLocated(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[2]/div/ng-select/div/div[3]/ul/li[2]")));
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[2]/div/ng-select/div/div[3]/ul/li[1]")).click();
        String headerHome = driver.findElement(By.xpath("/html/body/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/h1")).getText();
        assertTrue(headerHome.contains("AssetManagerWallet"));
        wait.until(visibilityOfElementLocated(By.xpath("//*[@id=\"manage-orders\"]")));
        String orderBookWalletID = driver.findElement(By.xpath("//*[@id=\"manage-orders\"]")).getText();
        assertTrue(orderBookWalletID.contains("AssetManagerWallet"));
        validateHeadersOnHomePageTableTG1376();
    }

    @Test
    public void shouldShowDashBoardTilesColorTG1375() throws InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        String myProducts = driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-dashboard/div/app-counter-tile[1]/div/a/div/div[1]/span")).getText();
        System.out.println(myProducts);
        assertTrue(myProducts.contains("My Products"));
        validateColourOfElementByCSS(".dash-grid > app-counter-tile:nth-child(1)", "rgba(206, 85, 61, 1)");
        validateColourOfElementByCSS(".dash-grid > app-counter-tile:nth-child(2)", "rgba(73, 164, 95, 1)");
        validateColourOfElementByCSS(".dash-grid > app-counter-tile:nth-child(3)", "rgba(232, 160, 46, 1)");
        validateColourOfElementByCSS(".dash-grid > app-counter-tile:nth-child(4)", "rgba(45, 113, 180, 1)");
    }

    @Test
    public void shouldDisplayRecapTable() throws InterruptedException{
        loginAndVerifySuccess("am", "alex01");
        navigateToInviteInvestorPage();
        inviteAnInvestor("recapTableTest1@setl.io", "Jordan", "Miller", "Success!");
    }
}
