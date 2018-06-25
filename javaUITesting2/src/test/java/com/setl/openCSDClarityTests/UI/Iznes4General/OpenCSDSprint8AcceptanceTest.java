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
import static SETLAPIHelpers.DatabaseHelper.validateTimeZoneUpdate;
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

public class OpenCSDSprint8AcceptanceTest {

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = new Timeout (35000);
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
        String randomLEI = "16614748475934658531";
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        fillOutFundDetailsStep1("none");
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
        wait.until(elementToBeClickable(driver.findElement(By.id("saveFundShareBottom"))));
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

}
