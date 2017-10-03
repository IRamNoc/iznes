package com.setl.openCSDClarityTests.UI.Login;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDLoginAcceptanceTest {

    private static final Logger logger = LogManager.getLogger(OpenCSDLoginAcceptanceTest.class);

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
    public void shouldLandOnLoginPage() throws IOException, InterruptedException {
        navigateToLoginPage();
        Thread.sleep(1);
    }
    @Test
    public void shouldLoginAndVerifySuccess() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
    }
    @Test
    public void shouldLogoutAndVerifySuccess() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
        logout();
    }
    @Test
    public void shouldNotLoginWithIncorrectPassword() throws IOException, InterruptedException {
        navigateToLoginPage();
        enterLoginCredentialsUserName("Emmanuel");
        enterLoginCredentialsPassword("WrongPassword");
        clickLoginButton();
        driver.findElement(By.xpath("/html/body/app-root/jaspero-alerts/jaspero-alert/div[2]")).isDisplayed();
    }
    @Test
    public void shouldShowPopupForUsernameRequired() throws IOException, InterruptedException {
        navigateToLoginPage();
        enterLoginCredentialsUserName("Emmanuel");
        driver.findElement(By.id("username-field")).clear();
        enterLoginCredentialsPassword("jordan");
        driver.findElement(By.id("password-field")).clear();
    }
    @Ignore
    @Test
    public void shouldRequirePasswordToLogin() throws IOException, InterruptedException {
      navigateToLoginPage();
      enterLoginCredentialsUserName("Emmanuel");
      driver.findElement(By.id("login-submit")).click();
    }
}
