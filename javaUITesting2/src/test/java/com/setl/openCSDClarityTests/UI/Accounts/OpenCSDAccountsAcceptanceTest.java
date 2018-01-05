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
    navigateToPage("my-account");
    myAccountClearField("DisplayName");
    myAccountSendKeys("DisplayName", "Testing");
    clickMyAccountSubmit();
    //query the database and assert that display name has been changed

  }
  @Test
  public void shouldEditFirstname() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("FirstName");
    myAccountSendKeys("FirstName", "Testing");
    clickMyAccountSubmit();
    //query the database and assert that first name has been changed
  }

  @Test
  public void shouldEditLastname() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("LastName");
    myAccountSendKeys("LastName", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that last name has been changed
  }

  @Test
  public void shouldEditMobilePhone() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MobilePhone");
    myAccountSendKeys("MobilePhone", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that mobile number has been changed
  }

  @Test
  public void shouldEditAddress() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address1");
    myAccountSendKeys("Address1", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that address has been changed
  }

  @Test
  public void shouldEditAddressPrefix() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("AddressPrefix");
    myAccountSendKeys("AddressPrefix", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that address prefix has been changed
  }

  @Test
  public void shouldEditCity() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address3");
    myAccountSendKeys("Address3", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that city has been changed
  }

  @Test
  public void shouldEditState() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address4");
    myAccountSendKeys("Address4", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that state or area has been changed
  }

  @Test
  public void shouldEditPostalCode() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("PostalCode");
    myAccountSendKeys("PostalCode", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that postcode has been changed
  }

  @Test
  @Ignore
  //Ignored because country selection is broken, need to find a new way to select a country
  public void shouldEditCountry() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("Address3");
    Thread.sleep(2);
    myAccountSendKeys("Address3", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that country has been changed
  }

  @Test
  public void shouldEditMemorableQuestion() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MemorableQuestion");
    myAccountSendKeys("MemorableQuestion", "Testing");
    clickMyAccountSubmit();
      //query the database and assert that display name has been changed
  }

  @Test
  public void shouldEditMemorableAnswer() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("MemorableAnswer");
    myAccountSendKeys("MemorableAnswer", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  public void shouldEditProfileText() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    //myAccountClearField("ProfileText");
    //myAccountSendKeys("ProfileText", "Testing");
    clickMyAccountSubmit();
  }

  @Test
  @Ignore
  //Test I want to add soon which will check all required fields are entered and only then can the save button be clicked
  public void shouldNotSaveAccountUnlessAllRequiredFieldsAreEntered() throws IOException, InterruptedException {
  }

  @Test
  public void shouldResetAllMyAccountDetails() throws IOException, InterruptedException {
    loginAndVerifySuccess(adminuser, adminuserPassword);
    navigateToDropdown("menu-account-module");
    navigateToPage("my-account");
    myAccountClearField("DisplayName");
    myAccountSendKeys("DisplayName", "null");
    myAccountClearField("FirstName");
    myAccountSendKeys("FirstName", "null");
    myAccountClearField("LastName");
    myAccountSendKeys("LastName", "null");
    myAccountClearField("MobilePhone");
    myAccountSendKeys("MobilePhone", "null");
    myAccountClearField("Address1");
    myAccountSendKeys("Address1", "null");
    myAccountClearField("AddressPrefix");
    myAccountSendKeys("AddressPrefix", "null");
    myAccountClearField("Address3");
    myAccountSendKeys("Address3", "null");
    myAccountClearField("Address4");
    myAccountSendKeys("Address4", "null");
    myAccountClearField("PostalCode");
    myAccountSendKeys("PostalCode", "null");
    myAccountClearField("MemorableQuestion");
    myAccountSendKeys("MemorableQuestion", "null");
    myAccountClearField("MemorableAnswer");
    myAccountSendKeys("MemorableAnswer", "null");
    clickMyAccountSubmit();
      //query the database and assert that all fields have changed to null
  }
}
