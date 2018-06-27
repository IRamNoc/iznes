package com.setl.openCSDClarityTests.UI.Iznes0Navigation;

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
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.navigateToPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageById;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageContains;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.adminuser;
import static com.setl.UI.common.SETLUIHelpers.SetUp.adminuserPassword;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.openqa.selenium.support.ui.ExpectedConditions.elementToBeClickable;
import static org.openqa.selenium.support.ui.ExpectedConditions.visibilityOfElementLocated;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDNavigationAcceptanceTest {

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
    public Timeout globalTimeout = new Timeout(55000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldNavigateToManagementCompany() throws IOException, InterruptedException {
        //test thread.sleep to see if not having time to connect to the wallet node is causing issues.
        Thread.sleep(45000);
        loginAndVerifySuccess("am", "alex01");
        navigateToPageByID("menu-management-company");
        verifyCorrectPage("Management Company");
    }

    @Test
    public void shouldNavigateToOrderBook() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToPageByID("menu-manage-orders");
        verifyCorrectPageContains("Order Book");
    }

    @Test
    public void shouldNavigateToMyProductsFromHomepageButtons() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-dashboard/div/app-counter-tile[1]/div/a")).click();
        verifyCorrectPageContains("Shares / Funds / Umbrella funds");
    }

    @Test
    public void shouldNavigateToRecordkeeping() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-am-report-section");
        navigateToPageByID("holders-list");
        verifyCorrectPage("Recordkeeping");
    }

    @Test
    public void shouldNavigateToRecordKeepingHomepage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-dashboard/div/app-counter-tile[4]/div/a")).click();
        verifyCorrectPage("Recordkeeping");
    }

    @Test
    public void shouldNavigateToPrecentralization() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-am-report-section");
        navigateToPageByID("menu-report-centralization");
        verifyCorrectPage("Precentralisation Report: All Shares");
    }

    @Test
    public void shouldNavigateToPrecentralizationHomepage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-dashboard/div/app-counter-tile[3]/div/a")).click();
        verifyCorrectPage("Precentralisation Report: All Shares");
    }

    @Test
    public void shouldNavigateToOnBoadingManagement() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("top-menu-my-clients");
        navigateToPageByID("top-menu-onboarding-management");
        verifyCorrectPage("On-boarding Management");
    }

    @Test
    public void shouldNavigateToInviteInvestors() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("top-menu-my-clients");
        navigateToPageByID("top-menu-invite-investor");
        verifyCorrectPage("Invite Investors to IZNES");
    }

    @Test
    public void shouldNavigateToFund() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-product-home");
        verifyCorrectPage("Shares / Funds / Umbrella funds");
    }

    @Test
    public void shouldNavigateToNetAssetValue() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-nav");
        verifyCorrectPageById("Net asset value");
    }

    @Test
    public void shouldNavigateToNAVHomepage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/app-dashboard/div/app-counter-tile[2]/div/a")).click();
        assertTrue(driver.findElement(By.id("NAV-Title")).getText().equals("Net asset value"));
    }

    @Test
    public void shouldNavigateToHomepage() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-nav");
        driver.findElement(By.id("menu-home")).click();
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/h1")).getText().contains("Home"));
    }
    @Test
    public void shouldNavigateToHomepageFromLogo() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-nav");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[1]/a")).click();
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/ng-component/div/h1")).getText().contains("Home"));
    }

    @Test
    public void shouldNavigateToMessages() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/app-navigation-topbar/header/div[2]/div[3]/div[1]/a")).click();
        assertTrue(driver.findElement(By.xpath("//*[@id=\"iznes\"]/app-root/app-basic-layout/div/ng-sidebar-container/div/div/div/main/div/div/setl-messages/div/div[2]/h2")).getText().contains("Inbox"));
    }

    @Test
    public void shouldNavigateToMyInformation() throws IOException, InterruptedException {
        WebDriverWait wait = new WebDriverWait(driver, timeoutInSeconds);
        loginAndVerifySuccess("am", "alex01");
        driver.findElement(By.id("dropdown-user")).click();
        wait.until(visibilityOfElementLocated(By.id("top-menu-my-info")));
        wait.until(elementToBeClickable(By.id("top-menu-my-info")));
        driver.findElement(By.id("top-menu-my-info")).click();
        assertTrue(driver.findElement(By.xpath("//*[@id=\"ofi-welcome-additionnal\"]")).getText().equals("MY INFORMATION"));
    }

    @Test
    public void shouldNavigateToSubPortfolioTG278() throws IOException, InterruptedException {
        loginAndVerifySuccess("investor", "alex01");
        navigateToPageByID("menu-sub-portfolio");
        verifyCorrectPage("Sub-portfolio");
    }
}
