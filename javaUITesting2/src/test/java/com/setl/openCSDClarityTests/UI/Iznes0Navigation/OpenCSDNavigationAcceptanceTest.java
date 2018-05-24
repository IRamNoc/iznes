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
import org.openqa.selenium.JavascriptExecutor;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.navigateToPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPage;
import static com.setl.UI.common.SETLUIHelpers.PageHelper.verifyCorrectPageById;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.adminuser;
import static com.setl.UI.common.SETLUIHelpers.SetUp.adminuserPassword;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;


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
    @Ignore("Page removed for now")
    public void shouldNavigateToFundHoldings() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToPageByID("menu-asset-manager-dashboard");
        verifyCorrectPage("My Account");
    }

    @Test
    @Ignore("My Account functionality removed")
    public void shouldNavigateToMyAccount() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("topBarMenu");
        navigateToPageByID("topBarMyAccount");
        verifyCorrectPage("My Account");
    }

    @Test
    @Ignore
    public void shouldNavigateToRelationships() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/relationships");
        verifyCorrectPage("My Account");
    }

    @Test
    @Ignore("Page removed for now")
    public void shouldNavigateToSICAV() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        navigateToDropdown("menu-my-products");
        navigateToPageByID("menu-sicav");
        verifyCorrectPage("My Account");
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
    @Ignore
    public void shouldNavigateToCreateResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/create-resolution");
        verifyCorrectPage("");
    }

    @Test
    @Ignore
    public void shouldNavigateToIssueResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/issue-resolution");
        verifyCorrectPage("");
    }

    @Test
    @Ignore
    public void shouldNavigateToDistribution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/distribution");
        verifyCorrectPage("");
    }

    @Test
    @Ignore
    public void shouldNavigateToMergerAbsorption() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/merger-absorption");
        verifyCorrectPage("");
    }

    @Test
    @Ignore
    public void shouldNavigateToCouponPayment() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "alex01");
        //waitForHomePageToLoad();
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/coupon-payment");
        verifyCorrectPage("");
    }

    @Test
    @Ignore
    public void shouldNavigateToSplit() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/split");
        verifyCorrectPage("");
    }
}