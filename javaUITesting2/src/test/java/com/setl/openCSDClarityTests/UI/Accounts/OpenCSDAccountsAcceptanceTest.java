package com.setl.openCSDClarityTests.UI.Accounts;

import com.setl.UI.common.SETLUtils.RepeatRule;
import com.setl.UI.common.SETLUtils.ScreenshotRule;
import com.setl.UI.common.SETLUtils.TestMethodPrinterRule;
import custom.junit.runners.OrderedJUnit4ClassRunner;
import jdk.nashorn.internal.ir.annotations.Ignore;
import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.junit.Rule;
import org.openqa.selenium.By;

import java.io.IOException;

import static com.setl.UI.common.SETLUIHelpers.AccountsDetailsHelper.*;
import static com.setl.UI.common.SETLUIHelpers.LoginAndNavigationHelper.*;
import static com.setl.UI.common.SETLUIHelpers.PopupMessageHelper.verifyPopupMessageText;
import static com.setl.UI.common.SETLUIHelpers.SetUp.*;
import static com.setl.workflows.LoginAndNavigateToPage.loginAndNavigateToPage;
import static org.junit.Assert.fail;

@RunWith(OrderedJUnit4ClassRunner.class)
public class OpenCSDAccountsAcceptanceTest {

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

  public static void myAccountSendKeys(String field, String text){
    driver.findElement(By.id("ud" + field)).sendKeys(text);
  }
  @Test
  public void shouldEditFirstname() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("FirstName", "Testing");
  }
  @Test
  public void shouldEditLastname() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("LastName", "Testing");
  }
  @Test
  public void shouldEditMobilePhone() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("MobilePhone", "Testing");
  }
  @Test
  public void shouldEditAddress() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("Address1", "Testing");
  }
  @Test
  public void shouldEditAddressPrefix() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("AddressPrefix", "Testing");
  }
  @Test
  public void shouldEditCity() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("Address3", "Testing");
  }
  @Test
  public void shouldEditState() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("Address4", "Testing");
  }
  @Test
  public void shouldEditPostalCode() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("PostalCode", "Testing");
  }
  @Test
  public void shouldEditCountry() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("Address3", "Testing");
  }
  @Test
  public void shouldEditMemorableQuestion() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("MemorableQuestion", "Testing");
  }
  @Test
  public void shouldEditMemorableAnswer() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("MemorableAnswer", "Testing");
  }
  @Ignore
  @Test
  public void shouldEditProfileText() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("Address3", "Testing");
  }
  @Test
  public void shouldResetAllMyAccountDetails() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("account/my-account");
    myAccountSendKeys("FirstName", "Testing");
    myAccountSendKeys("LastName", "Testing");
    myAccountSendKeys("MobilePhone", "Testing");
    myAccountSendKeys("Address1", "Testing");
    myAccountSendKeys("AddressPrefix", "Testing");
    myAccountSendKeys("Address3", "Testing");
    myAccountSendKeys("Address4", "Testing");
    myAccountSendKeys("PostalCode", "Testing");
    myAccountSendKeys("MemorableQuestion", "Testing");
    myAccountSendKeys("MemorableAnswer", "Testing");
  }
}
