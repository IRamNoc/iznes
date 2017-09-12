package com.setl.openCSDTests.UI.Accounts;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.acceptCookies;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDAccountsAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDAccountsAcceptanceTest.class);

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
        loginAndNavigateToPage(adminuser, adminuserPassword, "menu_accounts");
        acceptCookies();
        navigateToAddAccountTab();
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldCreateNewAccount() throws IOException, InterruptedException {
        String accountDetails[] = generateRandomAccountDetails();
        populateNewAccountFields(accountDetails[0], accountDetails[1], "2");
        verifyPopupMessageText("Account Added Successfully", "Added Success message not displayed ");
        logger.info("Account created: " + accountDetails[0] + " ");
    }

    @Test
    public void shouldCreateAccount() throws IOException, InterruptedException {
        String accountDetails[] = generateRandomAccountDetails();
        populateNewAccountFields(accountDetails[0], accountDetails[1], "2");
        verifyPopupMessageText("Account Added Successfully", "Added Success message not displayed ");
        logger.info("Account created: " + accountDetails[0] + " ");
    }

}
