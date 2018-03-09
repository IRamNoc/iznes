package com.setl.openCSDClarityTests.UI.Navigation;

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

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.loginAndVerifySuccess;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.navigateToPage;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.adminuser;
import static com.setl.UI.common.SETLUIHelpers.SetUp.adminuserPassword;
import static org.junit.Assert.fail;


@RunWith(OrderedJUnit4ClassRunner.class)



public class OpenCSDNavigationAcceptanceTest {

    public static String connectionString = "jdbc:mysql://localhost:9999/setlnet?nullNamePatternMatchesAll=true";

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
    public Timeout globalTimeout = new Timeout(30000);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldNavigateToFundHoldings() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToPageByID("menu-asset-manager-dashboard");
    }

    @Test
    public void shouldNavigateToMyAccount() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("dropdown-user");
        navigateToPageByID("top-menu-my-info");
    }

    @Test
    @Ignore
    public void shouldNavigateToRelationships() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-account-module");
        navigateToPage("account/relationships");
    }

    @Test
    public void shouldNavigateToManagementCompany() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-management-company");
    }

    @Test
    public void shouldNavigateToSICAV() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPageByID("menu-sicav");
    }

    @Test
    public void shouldNavigateToFund() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");

    }

    @Test
    public void shouldNavigateToNetAssetValue() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-product-module");
        navigateToPage2("product-module/net-asset-value");
    }

    @Test
    @Ignore
    public void shouldNavigateToCreateResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/create-resolution");
    }

    @Test
    @Ignore
    public void shouldNavigateToIssueResolution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/issue-resolution");
    }

    @Test
    @Ignore
    public void shouldNavigateToDistribution() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/distribution");
    }

    @Test
    @Ignore
    public void shouldNavigateToMergerAbsorption() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/merger-absorption");
    }

    @Test
    @Ignore
    public void shouldNavigateToCouponPayment() throws IOException, InterruptedException {
        loginAndVerifySuccess("am", "trb2017");
        navigateToDropdown("menu-corporate-actions");
        navigateToPage2("corporate-actions/coupon-payment");
    }

    @Test
    @Ignore
    public void shouldNavigateToSplit() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-corporate-actions");
        navigateToPage("corporate-actions/split");
    }

}
