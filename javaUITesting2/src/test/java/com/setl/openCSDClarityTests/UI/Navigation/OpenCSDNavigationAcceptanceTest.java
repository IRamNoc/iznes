package com.setl.openCSDClarityTests.UI.Navigation;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static org.junit.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDNavigationAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDNavigationAcceptanceTest.class);

    @Rule
    public ScreenshotRule screenshotRule = new ScreenshotRule();
    @Rule
    public RepeatRule repeatRule = new RepeatRule();
    @Rule
    public Timeout globalTimeout = Timeout.seconds(300);
    @Rule
    public TestMethodPrinterRule pr = new TestMethodPrinterRule(System.out);

    @Before
    public void setUp() throws Exception {
        testSetUp();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldNavigateToMessages() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("messages");
    }
    @Test
    public void shouldNavigateToHome() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("messages");
        navigateToPage("home");
    }
    @Test
    public void shouldNavigateToWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("wallets");
    }
    @Test
    public void shouldNavigateToKYCAdmin() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("kyc-admin");
    }
    @Test
    public void shouldNavigateToManageOrders() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToPage("orders");
    }

    @Test
    public void shouldNavigateToUsers() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administation");
        navigateToPage("user-administration/users");
    }

    @Test
    public void shouldNavigateToUserWallets() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administation");
        navigateToPage("user-administration/wallets");
    }

    @Test
    public void shouldNavigateToPermissions() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        navigateToDropdown("menu-user-administation");
        navigateToPage("user-administration/permissions");
    }
}
