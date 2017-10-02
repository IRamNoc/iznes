package com.setl.openCSDClarityTests.UI.Accounts;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.acceptCookies;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;
import static org.junit.Assert.fail;

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
        screenshotRule.setDriver(driver);
    }

    @Test
    public void shouldLandOnLoginPage() throws IOException, InterruptedException {
        loginAndVerifySuccess(adminuser, adminuserPassword);
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
    @Ignore
    @Test
    public void shouldRequirePasswordToLogin() throws IOException, InterruptedException {
      navigateToLoginPage();
      enterLoginCredentialsUserName("Emmanuel");
      driver.findElement(By.id("login-submit")).click();
    }
    @Test
    public void shouldEditDisplayname() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udDisplayName")).sendKeys("Testing");
    }
    @Test
    public void shouldEditFirstname() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udFirstName")).sendKeys("Testing");
    }
    @Test
    public void shouldEditLastname() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udLastName")).sendKeys("Testing");
    }
    @Test
    public void shouldEditMobilePhone() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      Thread.sleep(200);
      driver.findElement(By.id("udMobilePhone")).sendKeys("Testing");
    }
    @Test
    public void shouldEditAddress() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udAddress1")).sendKeys("Testing");
    }
    @Test
    public void shouldEditAddressPrefix() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udAddressPrefix")).sendKeys("Testing");
    }
    @Test
    public void shouldEditCity() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udAddress3")).sendKeys("Testing");
    }
    @Test
    public void shouldEditState() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udAddress4")).sendKeys("Testing");
    }
    @Test
    public void shouldEditPostalCode() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udPostalCode")).sendKeys("Testing");
    }
    @Test
    public void shouldEditCountry() throws IOException, InterruptedException {
      loginAndVerifySuccess(adminuser, adminuserPassword);
      navigateToDropdown("menu-account-module");
      navigateToPage("account/my-account");
      driver.findElement(By.id("udAddress3")).sendKeys("Testing");
    }
}
